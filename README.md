# 🚀 AI Career Catalyst

A full-stack AI career development platform that combines a **Next.js 15** frontend with a **Python FastAPI** backend to deliver personalized career coaching through **RAG (Retrieval-Augmented Generation)**, smart resume building, AI interview prep, and real-time industry intelligence.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)
![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=langchain)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-000?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📑 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [AI & GenAI Integration](#-ai--genai-integration)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [UI/UX Design System](#-uiux-design-system)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### 🤖 AI Career Advisor (RAG Pipeline)
- **Upload documents** (resumes, job descriptions, cover letters) as PDF or TXT
- Documents are **chunked, embedded, and stored in Pinecone** vector database
- **Conversational chat** with an AI that retrieves relevant context from your uploaded documents
- **Source attribution** — every answer shows which documents were referenced
- **Session memory** — maintains conversation history for follow-up questions
- **Job-Resume Match Analysis** — paste your resume and a job description to get a structured analysis with match score (0-100), skill gaps, missing keywords, and actionable recommendations

### 📊 Industry Intelligence Dashboard
- AI-generated salary ranges, growth rates, and demand levels for 50+ industries
- Top in-demand skills and key market trends
- Market outlook analysis (Positive/Neutral/Negative)
- Personalized skill recommendations
- **Auto-refreshes weekly** via Inngest background cron jobs
- Interactive charts built with Recharts

### 📝 AI Resume Builder
- Full Markdown editor with live preview (`@uiw/react-md-editor`)
- Guided sections: Contact, Summary, Experience, Education, Skills, Projects
- **"Improve with AI" button** per section — Gemini rewrites content with action verbs, metrics, and industry keywords
- ATS score tracking
- **One-click PDF export** via html2pdf.js
- Auto-saves on every edit

### 💼 AI Interview Preparation
- Generates **10 MCQ technical questions** tailored to your industry and skills
- Instant scoring with detailed explanations
- AI-generated **improvement tips** based on wrong answers
- Performance history tracking with trend charts
- Covers Technical and Behavioral categories

### ✉️ AI Cover Letter Generator
- Generates personalized cover letters from your profile + job description
- Uses your industry, skills, experience, and bio for context
- Professional markdown formatting
- Full CRUD — create, view, list, delete
- Saved per-user in the database

### 🔐 Authentication & Onboarding
- **Clerk** authentication with social login (Google, GitHub, etc.)
- Multi-step onboarding: industry selection (15 categories × 13 sub-industries), bio, experience, skills
- Automatic Clerk-to-database user sync via `checkUser()` helper

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  Next.js 15 App Router (React 19)                              │
│  ┌──────────┬──────────┬───────────┬──────────┬──────────────┐ │
│  │Dashboard │ Resume   │ Interview │Cover     │ AI Advisor   │ │
│  │(Recharts)│ (MD Edit)│ (Quiz)    │Letter    │ (Chat/Upload)│ │
│  └────┬─────┴────┬─────┴─────┬─────┴────┬─────┴──────┬───────┘ │
│       │          │           │          │            │          │
│  Server Actions (actions/*.js)         API Proxy Route         │
│  (Direct Gemini SDK calls)             /api/ai-advisor         │
└───────┼──────────┼───────────┼──────────┼────────────┼──────────┘
        │          │           │          │            │
        ▼          ▼           ▼          ▼            ▼
   ┌─────────┐ ┌─────────┐                    ┌──────────────┐
   │  Clerk  │ │  Neon   │                    │ Python       │
   │  Auth   │ │Postgres │                    │ FastAPI :8000│
   └─────────┘ │(Prisma) │                    │              │
               └─────────┘                    │ LangChain    │
                                              │ RAG Engine   │
                                              └──────┬───────┘
                                                     │
                                          ┌──────────┼──────────┐
                                          ▼          ▼          ▼
                                     ┌────────┐ ┌────────┐ ┌────────┐
                                     │Gemini  │ │Pinecone│ │Gemini  │
                                     │Embed   │ │VectorDB│ │LLM     │
                                     │(768-d) │ │        │ │(Chat)  │
                                     └────────┘ └────────┘ └────────┘
```

**Key architectural decisions:**
- The original 4 features (Dashboard, Resume, Interview, Cover Letter) use **direct Gemini SDK calls** from Next.js server actions — simple and fast
- The new RAG features (AI Advisor, Job Match) use a **separate Python FastAPI backend** with **LangChain** — necessary for complex chain orchestration, vector store management, and conversation memory
- The Next.js `/api/ai-advisor` route acts as a **proxy** to avoid CORS issues and keep the frontend clean

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15 (App Router, Turbopack) | SSR, routing, server actions |
| **UI Framework** | React 19 | Component rendering |
| **Styling** | Tailwind CSS 3 + custom design system | Glassmorphism, gradients, animations |
| **UI Components** | shadcn/ui (Radix UI primitives) | 15 base components (Button, Card, Tabs, etc.) |
| **Charts** | Recharts | Salary bars, interview score trends |
| **Icons** | Lucide React | Consistent iconography |
| **Auth** | Clerk (dark theme) | Sign-in, sign-up, session management |
| **Database** | PostgreSQL on Neon (serverless) | User data, resumes, assessments |
| **ORM** | Prisma | Type-safe database queries |
| **AI (Frontend)** | Google Gemini 2.5 Flash (`@google/generative-ai`) | Direct content generation |
| **AI (Backend)** | LangChain (`langchain-google-genai`) | RAG chains, memory, retrieval |
| **Vector DB** | Pinecone (Serverless, AWS us-east-1) | Document embeddings storage & similarity search |
| **Embeddings** | Google `embedding-001` (768 dimensions) | Document vectorization |
| **Backend** | Python FastAPI + Uvicorn | RAG API server |
| **Background Jobs** | Inngest | Weekly industry insight refresh (cron) |
| **PDF** | html2pdf.js (export), PyPDF (ingestion) | Resume export & document parsing |
| **Markdown** | react-markdown, @uiw/react-md-editor | Resume editing & rendering |
| **Forms** | React Hook Form + Zod | Validation |
| **Notifications** | Sonner | Toast messages |
| **Font** | Inter (Google Fonts) | Typography |

---

## 📁 Project Structure

```
Carrer_Coach/
├── app/                              # Next.js 15 App Router
│   ├── layout.js                     # Root layout (Clerk, ThemeProvider, Header, Footer)
│   ├── page.js                       # Landing page (Hero, Features, Stats, FAQ, CTA)
│   ├── globals.css                   # Design system (361 lines of tokens & utilities)
│   ├── not-found.jsx                 # Custom 404
│   ├── (auth)/                       # Auth route group
│   │   ├── layout.js
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   ├── (main)/                       # Authenticated route group
│   │   ├── layout.jsx                # Shared layout (grid-background, container)
│   │   ├── onboarding/              # User onboarding flow
│   │   │   ├── page.jsx
│   │   │   └── _components/onboarding-form.jsx
│   │   ├── dashboard/               # Industry insights dashboard
│   │   │   ├── page.jsx
│   │   │   ├── layout.js            # Suspense boundary
│   │   │   └── _component/dashboard-view.jsx  (Recharts, insights)
│   │   ├── resume/                  # AI resume builder
│   │   │   ├── page.jsx
│   │   │   └── _components/resume-builder.jsx (MD editor, PDF export)
│   │   ├── interview/              # Interview preparation
│   │   │   ├── page.jsx            # Assessment history
│   │   │   ├── layout.js
│   │   │   ├── mock/page.jsx       # Live quiz page
│   │   │   └── _components/quiz-list.jsx
│   │   ├── ai-cover-letter/        # Cover letter generator
│   │   │   ├── page.jsx            # List all letters
│   │   │   ├── new/page.jsx        # Create new letter
│   │   │   ├── [id]/page.jsx       # View specific letter
│   │   │   └── _components/cover-letter-list.jsx
│   │   └── ai-advisor/             # 🆕 RAG-powered AI advisor
│   │       ├── page.jsx
│   │       └── _components/ai-advisor-view.jsx (Chat, Upload, Job Match)
│   └── api/
│       ├── ai-advisor/route.js      # 🆕 Proxy to Python backend
│       └── inngest/route.js         # Inngest webhook handler
│
├── actions/                          # Next.js Server Actions
│   ├── user.js                      # updateUser, getUserOnboardingStatus
│   ├── dashboard.js                 # generateAIInsights, getIndustryInsights
│   ├── interview.js                 # generateQuiz, saveQuizResult, getAssessments
│   ├── resume.js                    # saveResume, getResume, improveWithAI
│   └── cover-letter.js             # generateCoverLetter, CRUD operations
│
├── components/
│   ├── header.jsx                   # Global nav (Growth Tools dropdown, Clerk auth)
│   ├── hero.jsx                     # Landing hero with 3D scroll effect
│   ├── scroll-to-top.jsx
│   ├── theme-provider.jsx           # next-themes wrapper
│   └── ui/                          # 15 shadcn/ui components
│       ├── accordion.jsx, badge.jsx, button.jsx, card.jsx,
│       ├── dialog.jsx, dropdown-menu.jsx, input.jsx, label.jsx,
│       ├── progress.jsx, radio-group.jsx, select.jsx, sonner.jsx,
│       └── tabs.jsx, textarea.jsx, alert-dialog.jsx
│
├── lib/
│   ├── prisma.js                    # Singleton Prisma client
│   ├── checkUser.js                 # Clerk → DB user sync helper
│   ├── utils.js                     # cn() class merge utility
│   └── inngest/
│       ├── client.js                # Inngest client config
│       └── function.js              # Weekly insight refresh cron
│
├── data/                            # Static data for landing page
│   ├── features.js                  # 5 feature cards
│   ├── howItWorks.js                # 4-step process
│   ├── testimonial.js               # 3 testimonials
│   ├── faqs.js                      # FAQ accordion data
│   └── industries.js                # 15 categories × 13 sub-industries
│
├── hooks/
│   └── use-fetch.js                 # Generic async state wrapper
│
├── prisma/
│   ├── schema.prisma                # 5 models (User, Resume, Assessment, CoverLetter, IndustryInsight)
│   └── migrations/
│
├── backend/                          # 🆕 Python FastAPI + LangChain
│   ├── requirements.txt             # Python dependencies
│   ├── main.py                      # FastAPI server (6 endpoints)
│   ├── rag_engine.py                # RAG pipeline (ingest, query, analyze)
│   └── prompts.py                   # LangChain prompt templates
│
├── public/                          # Static assets
│   ├── aicatalyst.png               # Logo
│   ├── catalyst_hero.png            # Hero screenshot
│   └── logo.png, banner*.jpeg
│
├── middleware.js                     # Clerk route protection
├── package.json
├── tailwind.config.mjs
└── .env                             # Environment variables
```

---

## 🗃️ Database Schema

**PostgreSQL on Neon** with **Prisma ORM**. Five models:

| Model | Purpose | Key Fields |
|---|---|---|
| **User** | User profiles synced from Clerk | `clerkUserId`, `email`, `industry`, `bio`, `experience`, `skills[]` |
| **Resume** | One resume per user (markdown) | `content` (Text), `atsScore`, `feedback` |
| **Assessment** | Interview quiz results | `quizScore`, `questions` (JSON[]), `improvementTip` |
| **CoverLetter** | Generated cover letters | `content`, `companyName`, `jobTitle`, `jobDescription`, `status` |
| **IndustryInsight** | AI-generated market data | `salaryRanges` (JSON[]), `growthRate`, `demandLevel`, `topSkills[]`, `marketOutlook`, `keyTrends[]`, `recommendedSkills[]` |

**Relationships:**
- `User` → `Resume` (1:1)
- `User` → `Assessment` (1:many)
- `User` → `CoverLetter` (1:many)
- `User` → `IndustryInsight` (many:1, via `industry` field)

---

## 🤖 AI & GenAI Integration

### Direct Gemini Calls (Frontend Server Actions)
The original features call Google Gemini 2.5 Flash directly using `@google/generative-ai`:

| Feature | Server Action | What Gemini Does |
|---|---|---|
| Dashboard | `generateAIInsights()` | Generates salary data, growth rates, skills, trends as structured JSON |
| Resume | `improveWithAI()` | Rewrites resume sections with action verbs, metrics, industry keywords |
| Interview | `generateQuiz()` | Creates 10 MCQ questions + explanations for user's industry/skills |
| Interview | `saveQuizResult()` | Generates improvement tips based on wrong answers |
| Cover Letter | `generateCoverLetter()` | Writes personalized letters using user profile + job details |

### LangChain RAG Pipeline (Python Backend)
The new AI Advisor feature uses a full RAG architecture:

```
Document Upload Flow:
  PDF/TXT → PyPDFLoader/TextLoader → RecursiveCharacterTextSplitter (1000/200)
  → GoogleGenerativeAIEmbeddings (768-d) → PineconeVectorStore.add_documents()
  → Document summary generated via Gemini

Chat Query Flow:
  User question → ConversationalRetrievalChain
  → Condense question with history → Pinecone similarity search (top 5)
  → Retrieved chunks + conversation memory → Gemini generates answer
  → Response with source document attribution

Job Match Flow:
  Resume text + Job Description → JOB_MATCH_PROMPT → Gemini
  → Structured JSON: match score, matching skills, missing skills,
    experience analysis, recommendations, keywords to add
```

**LangChain components used:**
- `ChatGoogleGenerativeAI` — LLM wrapper for Gemini
- `GoogleGenerativeAIEmbeddings` — Embedding model (768-d vectors)
- `PineconeVectorStore` — Vector store integration
- `ConversationalRetrievalChain` — RAG chain with memory
- `ConversationBufferWindowMemory` — 10-message sliding window
- `RecursiveCharacterTextSplitter` — Document chunking
- `ChatPromptTemplate` / `MessagesPlaceholder` — Prompt engineering

### Inngest Background Jobs
- `generateIndustryInsights` cron runs **every Sunday at midnight**
- Iterates all industries in the database
- Regenerates insights via Gemini and updates `IndustryInsight` records
- Keeps dashboard data fresh without user intervention

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.10+** (for RAG backend)
- **PostgreSQL** database ([Neon](https://neon.tech) recommended — free tier available)
- **Clerk** account ([clerk.com](https://clerk.com) — free tier available)
- **Google Gemini API key** ([ai.google.dev](https://ai.google.dev))
- **Pinecone** account ([pinecone.io](https://www.pinecone.io) — free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sanskar-502/Carrer_Coach.git
cd Carrer_Coach

# 2. Install frontend dependencies
npm install

# 3. Set up environment variables (see section below)
cp .env.example .env  # then edit with your keys

# 4. Set up the database
npx prisma generate
npx prisma db push

# 5. Set up the Python backend
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
cd ..
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database (Neon Postgres)
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# AI - Google Gemini
GEMINI_API_KEY=AIza...

# AI - Pinecone Vector Database (for RAG backend)
PINECONE_API_KEY=pcsk_...
```

> **Note:** The Python backend reads `GEMINI_API_KEY` and `PINECONE_API_KEY` from the same root `.env` file.

---

## ▶️ Running the Application

You need **two terminals** — one for the frontend, one for the backend:

### Terminal 1 — Next.js Frontend
```bash
npm run dev
# → http://localhost:3000
```

### Terminal 2 — Python RAG Backend
```bash
cd backend
.\venv\Scripts\activate          # Windows
# source venv/bin/activate       # macOS/Linux
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### Verify Both Are Running
- Frontend: visit `http://localhost:3000`
- Backend health check: visit `http://localhost:8000/api/health`
- AI Advisor page: sign in → Growth Tools → AI Advisor (status badge should show "RAG Backend Online")

---

## 📡 API Reference

### Python Backend Endpoints (port 8000)

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/health` | Health check & component status | — |
| `POST` | `/api/chat` | RAG-powered career advisor chat | `{ message, session_id?, user_id? }` |
| `POST` | `/api/upload` | Upload document for RAG ingestion | `multipart/form-data: file, user_id` |
| `POST` | `/api/analyze` | Job-resume match analysis | `{ resume_text, job_description }` |
| `GET` | `/api/documents` | List all ingested documents | — |
| `POST` | `/api/clear-session` | Clear conversation memory | `session_id` |

### Next.js Proxy Route
All frontend requests go through `/api/ai-advisor?action=<action>` which proxies to the Python backend. This avoids CORS issues.

---

## 🎨 UI/UX Design System

Defined in `globals.css` (361 lines):

- **Glass-morphism**: `.glass-morphism`, `.glass-card` — backdrop blur + translucent backgrounds
- **Gradients**: `.gradient` (primary), `.gradient-secondary`, `.gradient-accent`, `.gradient-success`
- **Gradient text**: `.gradient-title`, `.gradient-text-secondary`, `.gradient-text-accent`
- **Animations**: `.floating-animation`, `.card-hover`, `.grid-background`
- **Dark mode**: Full dark theme with CSS variables, default enabled
- **Mobile-first**: Responsive utilities, disabled animations on mobile for performance
- **Hero parallax**: 3D perspective transform on scroll (`hero-image.scrolled`)

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build command (configured in package.json)
npm run render-build
# → runs: prisma generate && prisma db push && next build
```
1. Push to GitHub
2. Connect to Vercel
3. Set all environment variables in Vercel dashboard
4. Deploy

### Backend (Render / Railway / Fly.io)
```bash
# Start command
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
```
Set `RAG_BACKEND_URL` environment variable on Vercel to point to your deployed backend URL.

---

## 🛠️ Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| `ModuleNotFoundError: langchain_community` | Missing Python dependency | `pip install langchain-community` |
| `Server has closed the connection` on onboarding | Neon Postgres drops idle connections during slow Gemini calls | Already fixed — code re-queries DB after AI call |
| Backend shows "offline" on AI Advisor page | Python server not running | Start with `uvicorn main:app --reload --port 8000` |
| `PINECONE_API_KEY` error | Missing API key | Get free key from [pinecone.io](https://pinecone.io), add to `.env` |
| Pinecone index creation fails | Wrong cloud/region | The code auto-creates `career-advisor` index on AWS us-east-1 |
| Gemini API quota exceeded | Too many requests | Check quota at [ai.google.dev](https://ai.google.dev) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [LangChain](https://langchain.com/) — LLM orchestration framework
- [Pinecone](https://pinecone.io/) — Vector database
- [Google Gemini](https://ai.google.dev/) — LLM & embeddings
- [Clerk](https://clerk.com/) — Authentication
- [Prisma](https://prisma.io/) — ORM
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Inngest](https://inngest.com/) — Background jobs

---

**Built with ❤️ by Sanskar**