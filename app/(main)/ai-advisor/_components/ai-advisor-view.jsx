"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  Send,
  Upload,
  FileText,
  X,
  Loader2,
  Sparkles,
  Brain,
  Target,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Trash2,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------
async function apiCall(action, body, isFormData = false) {
  const options = { method: "POST" };
  if (isFormData) {
    options.body = body;
  } else {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`/api/ai-advisor?action=${action}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.detail || "Request failed");
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AIAdvisorView() {
  // --- Chat state ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- Documents state ---
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedResumeText, setUploadedResumeText] = useState("");
  const fileInputRef = useRef(null);

  // --- Job Match state ---
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Backend health ---
  const [backendStatus, setBackendStatus] = useState("checking");

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check backend health on mount
  useEffect(() => {
    fetch("/api/ai-advisor?action=health")
      .then((r) => r.json())
      .then(() => setBackendStatus("healthy"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  // --- Chat handlers ---
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await apiCall("chat", {
        message: userMessage,
        session_id: sessionId,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, I couldn't process that request. Please ensure the Python backend is running (`cd backend && uvicorn main:app --reload`).",
          error: true,
        },
      ]);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- Upload handlers ---
  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", "default");

      try {
        // Read the raw text content for resume auto-fill
        let rawText = "";
        if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
          rawText = await file.text();
        }

        const result = await apiCall("upload", formData, true);
        setDocuments((prev) => [...prev, result.document]);
        toast.success(`Uploaded "${file.name}" — ${result.document.chunks} chunks ingested`);

        // Auto-fill resume text if the uploaded doc is detected as a resume
        const docType = result.document?.type?.toLowerCase() || "";
        if (docType === "resume" || file.name.toLowerCase().includes("resume") || file.name.toLowerCase().includes("cv")) {
          const resumeContent = rawText || result.document?.summary || "";
          if (resumeContent) {
            setUploadedResumeText(resumeContent);
            if (!resumeText) {
              setResumeText(resumeContent);
              toast.info("📄 Resume detected! Auto-filled in Job Match tab.");
            }
          }
        }
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setIsUploading(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  // --- Job Match handlers ---
  const analyzeMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please provide both resume text and job description");
      return;
    }
    setIsAnalyzing(true);
    setMatchAnalysis(null);

    try {
      const result = await apiCall("analyze", {
        resume_text: resumeText,
        job_description: jobDescription,
      });
      setMatchAnalysis(result.analysis);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Suggested prompts ---
  const suggestions = [
    "Review my resume and suggest improvements",
    "What skills should I develop for AI Engineering?",
    "Help me prepare for a system design interview",
    "How can I transition into a Machine Learning role?",
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 gradient-secondary rounded-full animate-pulse" />
          <span className="text-sm font-semibold gradient-text-secondary uppercase tracking-wider">
            RAG-Powered AI Advisor
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight pb-2">
          <span className="gradient-title block">AI Career</span>
          <span className="gradient-title block">Advisor</span>
        </h1>
        <p className="text-foreground/70 text-base sm:text-lg md:text-xl font-medium max-w-2xl">
          🧠 Upload your resume & job descriptions, then chat with an AI advisor that{" "}
          <span className="gradient-text-accent font-bold">
            understands your documents
          </span>{" "}
          using RAG (Retrieval-Augmented Generation)
        </p>

        {/* Backend status badge */}
        <Badge
          variant="outline"
          className={`glass-card border-2 px-4 py-2 text-sm font-semibold ${
            backendStatus === "healthy"
              ? "border-emerald-500/30"
              : backendStatus === "offline"
              ? "border-red-500/30"
              : "border-yellow-500/30"
          }`}
        >
          <div className="relative mr-3">
            <div
              className={`w-3 h-3 rounded-full ${
                backendStatus === "healthy"
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"
                  : backendStatus === "offline"
                  ? "bg-red-500"
                  : "bg-yellow-500 animate-pulse"
              }`}
            />
          </div>
          {backendStatus === "healthy"
            ? "RAG Backend Online • LangChain + Pinecone"
            : backendStatus === "offline"
            ? "Backend Offline — Start with: cd backend && uvicorn main:app --reload"
            : "Checking backend..."}
        </Badge>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="glass-morphism border border-white/20 p-1 h-auto flex-wrap">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:gradient data-[state=active]:text-white gap-2 px-4 py-2.5"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">AI Chat</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:gradient data-[state=active]:text-white gap-2 px-4 py-2.5"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
            <span className="sm:hidden">Docs</span>
            {documents.length > 0 && (
              <Badge className="ml-1 h-5 min-w-[20px] text-xs gradient">
                {documents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="match"
            className="data-[state=active]:gradient data-[state=active]:text-white gap-2 px-4 py-2.5"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Job Match</span>
            <span className="sm:hidden">Match</span>
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* Chat Tab                                                        */}
        {/* ============================================================== */}
        <TabsContent value="chat">
          <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

            {/* Messages area */}
            <CardContent className="relative z-10 p-0">
              <div className="h-[500px] sm:h-[600px] overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl gradient flex items-center justify-center shadow-2xl">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 gradient-success rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold gradient-text-secondary">
                        Ask me anything about your career
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Upload your resume first for personalized advice, or
                        ask general career questions. I use RAG to ground my
                        answers in your documents.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setInput(s);
                            inputRef.current?.focus();
                          }}
                          className="glass-card border border-white/20 rounded-xl px-4 py-3 text-sm text-left hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
                            <span>{s}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Messages */
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "gradient text-white"
                            : msg.error
                            ? "glass-card border-2 border-red-500/30 bg-red-500/5"
                            : "glass-card border border-white/20"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold text-primary">
                              AI Advisor
                            </span>
                            {msg.sources && msg.sources.length > 0 && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 border-primary/30"
                              >
                                {msg.sources.length} source
                                {msg.sources.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        )}
                        <div
                          className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                            msg.role === "user"
                              ? "prose-invert"
                              : "dark:prose-invert"
                          }`}
                        >
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
                            {msg.sources.map((src) => (
                              <Badge
                                key={src}
                                variant="outline"
                                className="text-[10px] border-emerald-500/30 bg-emerald-500/5"
                              >
                                📄 {src}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass-card border border-white/20 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about your career, resume, or interview prep..."
                      className="w-full bg-background/50 border border-white/20 rounded-xl px-4 py-3 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                      rows={1}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="gradient h-11 w-11 p-0 rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by LangChain • Google Gemini • Pinecone RAG
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* Documents Tab                                                   */}
        {/* ============================================================== */}
        <TabsContent value="documents">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload zone */}
            <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                    <Upload className="h-5 w-5 text-emerald-500" />
                  </div>
                  <CardTitle className="text-xl gradient-text-secondary">
                    Upload Documents
                  </CardTitle>
                </div>
                <CardDescription>
                  Upload your resume, job descriptions, or any career documents. They'll be
                  chunked, embedded, and stored in Pinecone for RAG retrieval.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-white/20 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.md"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                  {isUploading ? (
                    <div className="space-y-3">
                      <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                      <p className="text-sm font-medium">
                        Processing & embedding document...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 rounded-2xl gradient mx-auto flex items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          Drop files here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports PDF, TXT, MD • Max 10MB per file
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* RAG Pipeline visualization */}
                <div className="mt-6 p-4 glass-card border border-white/10 rounded-xl">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    RAG Ingestion Pipeline
                  </p>
                  <div className="flex items-center justify-between text-xs gap-1">
                    {[
                      { icon: FileText, label: "Load" },
                      { icon: null, label: "→" },
                      { icon: Sparkles, label: "Split" },
                      { icon: null, label: "→" },
                      { icon: Brain, label: "Embed" },
                      { icon: null, label: "→" },
                      { icon: Target, label: "Pinecone" },
                    ].map((step, i) =>
                      step.icon ? (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg bg-primary/5 border border-primary/10"
                        >
                          <step.icon className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium">{step.label}</span>
                        </div>
                      ) : (
                        <ArrowRight
                          key={i}
                          className="h-3 w-3 text-muted-foreground flex-shrink-0"
                        />
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents list */}
            <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                    <FileText className="h-5 w-5 text-violet-500" />
                  </div>
                  <CardTitle className="text-xl gradient-text-secondary">
                    Ingested Documents
                  </CardTitle>
                </div>
                <CardDescription>
                  Documents stored as vector embeddings in Pinecone, ready for
                  retrieval during chat.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No documents uploaded yet</p>
                    <p className="text-xs mt-1">
                      Upload a resume or JD to get started
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="glass-card border border-white/10 rounded-xl p-4 hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FileText className="h-5 w-5 text-violet-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {doc.summary}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] border-blue-500/30 bg-blue-500/5"
                              >
                                {doc.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[10px] border-emerald-500/30 bg-emerald-500/5"
                              >
                                {doc.chunks} chunks
                              </Badge>
                              {doc.keyEntities?.slice(0, 3).map((e) => (
                                <Badge
                                  key={e}
                                  variant="outline"
                                  className="text-[10px] border-purple-500/30 bg-purple-500/5"
                                >
                                  {e}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* Job Match Tab                                                   */}
        {/* ============================================================== */}
        <TabsContent value="match">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resume input */}
              <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-lg">Your Resume</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  {!resumeText && uploadedResumeText && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mb-3 glass-card border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => {
                        setResumeText(uploadedResumeText);
                        toast.success("Resume text loaded from uploaded document");
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Use Uploaded Resume
                    </Button>
                  )}
                  {!resumeText && documents.length > 0 && !uploadedResumeText && (
                    <p className="text-xs text-muted-foreground mb-2">
                      💡 Tip: Upload a file named with "resume" or "cv" for auto-fill, or paste text below.
                    </p>
                  )}
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here, or upload a resume in the Documents tab for auto-fill..."
                    className="w-full h-64 bg-background/50 border border-white/20 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  />
                </CardContent>
              </Card>

              {/* JD input */}
              <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10">
                      <Target className="h-5 w-5 text-orange-500" />
                    </div>
                    <CardTitle className="text-lg">Job Description</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description here..."
                    className="w-full h-64 bg-background/50 border border-white/20 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Analyze button */}
            <div className="flex justify-center">
              <Button
                onClick={analyzeMatch}
                disabled={
                  isAnalyzing || !resumeText.trim() || !jobDescription.trim()
                }
                className="gradient px-8 py-6 text-lg font-bold shadow-2xl hover:scale-105 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing with LangChain...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Analyze Match
                  </>
                )}
              </Button>
            </div>

            {/* Analysis Results */}
            {matchAnalysis && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Overall Score */}
                <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
                  <CardContent className="relative z-10 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="8"
                            opacity="0.3"
                          />
                          <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${matchAnalysis.overallMatchScore * 2.51} 251`}
                          />
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="hsl(173, 80%, 50%)" />
                              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black gradient-text-secondary">
                            {matchAnalysis.overallMatchScore}%
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            MATCH
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-bold gradient-text-secondary mb-2">
                          Match Analysis
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {matchAnalysis.summary}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Matching skills */}
                  <Card className="glass-morphism border-2 border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        Matching Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-2">
                      {matchAnalysis.matchingSkills?.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between glass-card border border-white/10 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm font-medium">{s.skill}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              s.strength === "strong"
                                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                                : s.strength === "moderate"
                                ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                                : "border-orange-500/50 bg-orange-500/10 text-orange-400"
                            }`}
                          >
                            {s.strength}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Missing skills */}
                  <Card className="glass-morphism border-2 border-red-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5" />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        Skills Gap
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-2">
                      {matchAnalysis.missingSkills?.map((s, i) => (
                        <div
                          key={i}
                          className="glass-card border border-white/10 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{s.skill}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                s.importance === "critical"
                                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                                  : s.importance === "important"
                                  ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                                  : "border-blue-500/50 bg-blue-500/10 text-blue-400"
                              }`}
                            >
                              {s.importance}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            💡 {s.suggestion}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-3">
                    {matchAnalysis.recommendations?.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 glass-card border border-white/10 rounded-lg px-4 py-3"
                      >
                        <div className="w-6 h-6 rounded-full gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-white">{i + 1}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Keywords & Strong Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-base">🔑 Keywords to Add</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 flex flex-wrap gap-2">
                      {matchAnalysis.keywordsToAdd?.map((kw) => (
                        <Badge
                          key={kw}
                          className="glass-card border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 px-3 py-1"
                        >
                          + {kw}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5" />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-base">💪 Strong Points</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 flex flex-wrap gap-2">
                      {matchAnalysis.strongPoints?.map((sp) => (
                        <Badge
                          key={sp}
                          className="glass-card border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-1"
                        >
                          ✓ {sp}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
