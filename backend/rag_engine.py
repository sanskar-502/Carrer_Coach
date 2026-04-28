"""
RAG Engine — Core LangChain pipeline for the AI Career Advisor.

Architecture:
  Document Upload → PDF/Text Loader → Text Splitter → Embeddings → Pinecone
  User Query → Retrieval from Pinecone → Conversational Chain → Gemini → Response
"""

import os
import json
import uuid
import tempfile
from typing import List, Tuple, Optional

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from pinecone import Pinecone, ServerlessSpec

from prompts import (
    CAREER_ADVISOR_PROMPT,
    CONDENSE_QUESTION_PROMPT,
    JOB_MATCH_PROMPT,
    DOCUMENT_SUMMARY_PROMPT,
)

# Load environment variables from the project root .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
PINECONE_INDEX_NAME = "career-advisor"
EMBEDDING_MODEL = "models/gemini-embedding-001"
EMBEDDING_DIMENSION = 3072
LLM_MODEL = "gemini-2.5-flash"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


class RAGEngine:
    """
    Encapsulates the full RAG pipeline:
      - Document ingestion (PDF/TXT → split → embed → Pinecone)
      - Conversational retrieval (query → retrieve → generate)
      - Job-resume match analysis
    """

    def __init__(self):
        # --- LLM ---
        self.llm = ChatGoogleGenerativeAI(
            model=LLM_MODEL,
            google_api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0.7,
            convert_system_message_to_human=True,
        )

        # --- Embeddings ---
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model=EMBEDDING_MODEL,
            google_api_key=os.getenv("GEMINI_API_KEY"),
        )

        # --- Pinecone ---
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self._index_name = PINECONE_INDEX_NAME
        self._namespace = None  # may be set by _ensure_index if reusing an index
        self._ensure_index()

        vs_kwargs = {
            "index": self.pc.Index(self._index_name),
            "embedding": self.embeddings,
            "text_key": "text",
        }
        if self._namespace:
            vs_kwargs["namespace"] = self._namespace
        self.vector_store = PineconeVectorStore(**vs_kwargs)

        # --- Text Splitter ---
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

        # --- Per-session memory store  (session_id → Memory) ---
        self._memories: dict[str, ConversationBufferWindowMemory] = {}

        # --- Track ingested documents ---
        self.documents: list[dict] = []

    # ------------------------------------------------------------------
    # Pinecone index management
    # ------------------------------------------------------------------
    def _ensure_index(self):
        """Create the Pinecone index if it doesn't exist.
        
        If the free tier limit is reached (max 5 indexes), tries to find
        an existing index with 768 dimensions to reuse with a namespace.
        """
        existing_indexes = self.pc.list_indexes()
        existing_names = [idx.name for idx in existing_indexes]

        if self._index_name in existing_names:
            # Verify dimensions match
            try:
                idx = self.pc.Index(self._index_name)
                stats = idx.describe_index_stats()
                if stats.dimension != EMBEDDING_DIMENSION:
                    print(f"[RAG] ⚠ Index '{self._index_name}' has {stats.dimension} dims, need {EMBEDDING_DIMENSION}. Recreating...")
                    self.pc.delete_index(self._index_name)
                else:
                    print(f"[RAG] Using existing Pinecone index: '{self._index_name}' ({stats.dimension} dims)")
                    return
            except Exception as e:
                print(f"[RAG] Warning checking index dimensions: {e}")
                return

        # Index doesn't exist — try to create it
        try:
            print(f"[RAG] Creating Pinecone index: '{self._index_name}'...")
            self.pc.create_index(
                name=self._index_name,
                dimension=EMBEDDING_DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            print(f"[RAG] Index '{self._index_name}' created successfully.")
        except Exception as e:
            error_msg = str(e)
            if "FORBIDDEN" in error_msg or "403" in error_msg:
                # Free tier limit reached — try to reuse an existing index
                print(f"[RAG] ⚠ Cannot create new index (free tier limit reached).")
                print(f"[RAG] Existing indexes: {existing_names}")
                
                # Look for a compatible index (768 dimensions)
                for idx_info in existing_indexes:
                    try:
                        idx = self.pc.Index(idx_info.name)
                        stats = idx.describe_index_stats()
                        if stats.dimension == EMBEDDING_DIMENSION:
                            self._index_name = idx_info.name
                            self._namespace = "career-advisor"
                            print(f"[RAG] ✓ Reusing compatible index '{idx_info.name}' with namespace 'career-advisor'")
                            return
                    except Exception:
                        continue
                
                # No compatible index found
                raise RuntimeError(
                    f"Pinecone free tier limit reached (5 indexes max). "
                    f"Please delete an unused index at https://app.pinecone.io or "
                    f"rename PINECONE_INDEX_NAME to one of your existing indexes: {existing_names}"
                )
            else:
                raise

    # ------------------------------------------------------------------
    # Memory helpers
    # ------------------------------------------------------------------
    def _get_memory(self, session_id: str) -> ConversationBufferWindowMemory:
        if session_id not in self._memories:
            self._memories[session_id] = ConversationBufferWindowMemory(
                k=10,
                memory_key="chat_history",
                return_messages=True,
                output_key="answer",
            )
        return self._memories[session_id]

    # ------------------------------------------------------------------
    # Document Ingestion
    # ------------------------------------------------------------------
    async def ingest_document(
        self, file_path: str, file_name: str, user_id: str = "default"
    ) -> dict:
        """
        Load a PDF or text file, split it, embed chunks, and upsert into
        Pinecone.  Returns a summary of the ingested document.
        """
        # 1. Load document
        if file_name.lower().endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        else:
            loader = TextLoader(file_path, encoding="utf-8")

        raw_docs = loader.load()

        # 2. Split into chunks
        chunks = self.text_splitter.split_documents(raw_docs)

        # Add metadata
        doc_id = str(uuid.uuid4())
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                "doc_id": doc_id,
                "doc_name": file_name,
                "user_id": user_id,
                "chunk_index": i,
            })

        # 3. Upsert into Pinecone
        self.vector_store.add_documents(chunks)

        # 4. Generate a summary of the document
        full_text = "\n".join([d.page_content for d in raw_docs])
        summary_text = full_text[:2000]

        try:
            summary_chain = DOCUMENT_SUMMARY_PROMPT | self.llm
            summary_result = await summary_chain.ainvoke(
                {"document_content": summary_text}
            )
            clean = summary_result.content.strip()
            clean = clean.replace("```json", "").replace("```", "").strip()
            doc_summary = json.loads(clean)
        except Exception:
            doc_summary = {
                "documentType": "other",
                "summary": f"Document '{file_name}' uploaded successfully.",
                "keyEntities": [],
            }

        doc_info = {
            "id": doc_id,
            "name": file_name,
            "chunks": len(chunks),
            "type": doc_summary.get("documentType", "other"),
            "summary": doc_summary.get("summary", ""),
            "keyEntities": doc_summary.get("keyEntities", []),
        }
        self.documents.append(doc_info)

        return doc_info

    # ------------------------------------------------------------------
    # RAG Query (Conversational Retrieval)
    # ------------------------------------------------------------------
    async def query(
        self,
        question: str,
        session_id: str = "default",
        user_id: str = "default",
    ) -> dict:
        """
        Run a RAG query: retrieve relevant chunks from Pinecone, feed them
        alongside conversation history to Gemini, return the answer.
        """
        memory = self._get_memory(session_id)

        # Build the conversational retrieval chain
        chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 5},
            ),
            memory=memory,
            combine_docs_chain_kwargs={"prompt": CAREER_ADVISOR_PROMPT},
            condense_question_prompt=CONDENSE_QUESTION_PROMPT,
            return_source_documents=True,
            verbose=False,
        )

        result = await chain.ainvoke({"question": question})

        # Extract source document names
        sources = list({
            doc.metadata.get("doc_name", "Unknown")
            for doc in result.get("source_documents", [])
        })

        return {
            "answer": result["answer"],
            "sources": sources,
            "session_id": session_id,
        }

    # ------------------------------------------------------------------
    # Job-Resume Match Analysis
    # ------------------------------------------------------------------
    async def analyze_job_match(
        self, resume_text: str, job_description: str
    ) -> dict:
        """
        Analyze how well a resume matches a job description.
        Returns structured analysis with scores and recommendations.
        """
        chain = JOB_MATCH_PROMPT | self.llm

        result = await chain.ainvoke({
            "resume_text": resume_text,
            "job_description": job_description,
        })

        # Parse the JSON response
        clean = result.content.strip()
        clean = clean.replace("```json", "").replace("```", "").strip()

        try:
            analysis = json.loads(clean)
        except json.JSONDecodeError:
            analysis = {
                "overallMatchScore": 0,
                "summary": "Unable to parse analysis. Please try again.",
                "matchingSkills": [],
                "missingSkills": [],
                "experienceMatch": {"score": 0, "details": "N/A"},
                "recommendations": ["Please retry the analysis."],
                "keywordsToAdd": [],
                "strongPoints": [],
            }

        return analysis

    # ------------------------------------------------------------------
    # Utility
    # ------------------------------------------------------------------
    def get_documents(self) -> list[dict]:
        """Return the list of ingested documents."""
        return self.documents

    def clear_session(self, session_id: str):
        """Clear conversation memory for a session."""
        if session_id in self._memories:
            del self._memories[session_id]
