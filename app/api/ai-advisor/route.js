import { NextResponse } from "next/server";

const BACKEND_URL = process.env.RAG_BACKEND_URL || "http://localhost:8000";

/**
 * Proxy POST requests to the Python FastAPI backend.
 * Routes:
 *   /api/ai-advisor?action=chat     → POST /api/chat
 *   /api/ai-advisor?action=upload   → POST /api/upload
 *   /api/ai-advisor?action=analyze  → POST /api/analyze
 */
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "chat";

  const endpointMap = {
    chat: "/api/chat",
    upload: "/api/upload",
    analyze: "/api/analyze",
    "clear-session": "/api/clear-session",
  };

  const endpoint = endpointMap[action];
  if (!endpoint) {
    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let fetchOptions = {
      method: "POST",
    };

    if (contentType.includes("multipart/form-data")) {
      // Forward file uploads as-is
      const formData = await request.formData();
      fetchOptions.body = formData;
      // Don't set content-type header — let fetch set it with boundary
    } else {
      // Forward JSON
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
      fetchOptions.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[AI Advisor Proxy] Error forwarding to ${action}:`, error);
    return NextResponse.json(
      {
        error: "Failed to connect to AI backend. Make sure the Python server is running on port 8000.",
        details: error.message,
      },
      { status: 502 }
    );
  }
}

/**
 * Proxy GET requests to the Python FastAPI backend.
 * Routes:
 *   /api/ai-advisor?action=health     → GET /api/health
 *   /api/ai-advisor?action=documents  → GET /api/documents
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "health";

  const endpointMap = {
    health: "/api/health",
    documents: "/api/documents",
  };

  const endpoint = endpointMap[action];
  if (!endpoint) {
    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[AI Advisor Proxy] Error:`, error);
    return NextResponse.json(
      {
        error: "Failed to connect to AI backend.",
        details: error.message,
      },
      { status: 502 }
    );
  }
}
