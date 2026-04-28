"""
FastAPI Backend for the AI Career Advisor.

Endpoints:
  POST /api/chat       — RAG-powered career advisor chat
  POST /api/upload     — Upload resume/JD documents for RAG ingestion
  POST /api/analyze    — Job-resume match analysis
  GET  /api/documents  — List ingested documents
  GET  /api/health     — Health check
"""

import os
import tempfile
import uuid

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from rag_engine import RAGEngine

# ---------------------------------------------------------------------------
# App Setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AI Career Advisor — RAG Backend",
    description="LangChain-powered RAG backend for career coaching",
    version="1.0.0",
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singleton RAG engine
rag_engine: Optional[RAGEngine] = None


def get_rag_engine() -> RAGEngine:
    """Lazy-initialize the RAG engine."""
    global rag_engine
    if rag_engine is None:
        rag_engine = RAGEngine()
    return rag_engine


# ---------------------------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"
    user_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    session_id: str


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str


class DocumentInfo(BaseModel):
    id: str
    name: str
    chunks: int
    type: str
    summary: str
    keyEntities: List[str]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI Career Advisor RAG Backend",
        "version": "1.0.0",
        "components": {
            "llm": "Google Gemini 2.5 Flash",
            "embeddings": "Google Generative AI Embeddings",
            "vector_store": "Pinecone (Serverless)",
            "framework": "LangChain + FastAPI",
        },
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    RAG-powered career advisor chat.
    
    Retrieves relevant document chunks from Pinecone,
    combines with conversation history, and generates
    a contextual response using Gemini.
    """
    try:
        engine = get_rag_engine()
        result = await engine.query(
            question=request.message,
            session_id=request.session_id,
            user_id=request.user_id,
        )
        return ChatResponse(**result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.post("/api/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(default="default"),
):
    """
    Upload a document (PDF or TXT) for RAG ingestion.
    
    Pipeline: File → Load → Split → Embed → Pinecone
    """
    # Validate file type
    allowed_types = [".pdf", ".txt", ".md"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Allowed: {allowed_types}",
        )

    # Save to temp file
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=file_ext
        ) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        print(f"[UPLOAD] Saved temp file: {tmp_path} ({len(content)} bytes)")

        # Ingest into RAG pipeline
        engine = get_rag_engine()
        print(f"[UPLOAD] RAG engine initialized, starting ingestion...")
        doc_info = await engine.ingest_document(
            file_path=tmp_path,
            file_name=file.filename,
            user_id=user_id,
        )
        print(f"[UPLOAD] Ingestion complete: {doc_info['chunks']} chunks")

        return {
            "success": True,
            "document": doc_info,
            "message": f"Successfully ingested '{file.filename}' ({doc_info['chunks']} chunks)",
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Upload error: {str(e)}"
        )
    finally:
        # Clean up temp file
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.post("/api/analyze")
async def analyze_job_match(request: AnalyzeRequest):
    """
    Analyze how well a resume matches a job description.
    
    Uses LangChain to produce structured analysis with
    match scores, skill gaps, and recommendations.
    """
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required")
    if not request.job_description.strip():
        raise HTTPException(
            status_code=400, detail="Job description is required"
        )

    try:
        engine = get_rag_engine()
        analysis = await engine.analyze_job_match(
            resume_text=request.resume_text,
            job_description=request.job_description,
        )
        return {"success": True, "analysis": analysis}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Analysis error: {str(e)}"
        )


@app.get("/api/documents")
async def list_documents():
    """List all ingested documents."""
    engine = get_rag_engine()
    return {"documents": engine.get_documents()}


@app.post("/api/clear-session")
async def clear_session(session_id: str = "default"):
    """Clear conversation memory for a session."""
    engine = get_rag_engine()
    engine.clear_session(session_id)
    return {"success": True, "message": f"Session '{session_id}' cleared"}


# ---------------------------------------------------------------------------
# Run with: uvicorn main:app --reload --port 8000
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
