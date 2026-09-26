# EduFlow AI – Adaptive Course Studio & Learning Platform
**House of EdTech – Fullstack Developer Assessment Project**

**Candidate Name:** Rahulkumar Pali  
**GitHub Profile:** [github.com/prahul25](https://github.com/prahul25)  
**Repository:** [github.com/prahul25/house_of_edtech](https://github.com/prahul25/house_of_edtech)  
**LinkedIn:** [linkedin.com/in/rahulkumarpal25](https://www.linkedin.com/in/rahulkumarpal25/)  
**Live Production URL:** *(Deployable to Vercel in 1 click)*

---

## 1. Executive Summary & Vision

> **Mandate:** *"We don't expect a basic CRUD application. Please don’t build to-do lists, task managers and basic crud applications. We want you to showcase your intellect and approach to developing impactful applications..."*

**EduFlow AI** is an enterprise-grade **Adaptive Course Studio & Student Learning Experience Platform** purpose-built for the modern EdTech ecosystem.

It solves real-world pedagogy bottlenecks by combining:
1. **Relational Content Modeling (Prisma ORM & PostgreSQL):** Multi-tier hierarchy representing Courses, sequential Modules, rich Markdown Lessons, and auto-graded Quizzes with granular answer rationales.
2. **Role-Based Access Control (RBAC):** Dual-persona access isolating Instructor Studio workflows from Student Learning experiences with cryptographic JWT sessions and Next.js middleware protection.
3. **AI-Powered Accelerators (Google Gemini 1.5):**
   - **AI Syllabus Architect:** Auto-generates complete multi-module curricula from a single subject prompt.
   - **In-Lesson AI Tutor:** Answers student questions strictly grounded in the context of the active lesson notes.
   - **AI Quiz Generator:** Automatically drafts scored assessments with answer keys from lesson text.
4. **Learning Progress & Attempt Persistence:** Real-time tracking of completed lessons, module progress percentages, and scored quiz evaluation with instant feedback.

---

## 2. System Architecture

```mermaid
graph TD
    Client["Client Browser (React 19 / Next.js 16)"]
    
    subgraph Edge & Middleware
        MW["Next.js Route Middleware (RBAC & JWT Verification)"]
    end
    
    subgraph Server Layer (Next.js App Router)
        AuthActions["Auth Actions (Bcrypt + JOSE JWT)"]
        CourseActions["Course & Module Studio Actions (Zod Validated)"]
        EnrollActions["Enrollment & Progress Tracking Engine"]
        QuizActions["Quiz Evaluator & Auto-Grader"]
        AIService["Gemini AI Service (Syllabus, Tutor, Quiz)"]
    end
    
    subgraph Data & Persistence
        Prisma["Prisma ORM (Connection Pool)"]
        Postgres[("PostgreSQL Database (Neon / Supabase)")]
    end
    
    Client --> MW
    MW --> ServerLayer
    ServerLayer --> Prisma
    Prisma --> Postgres
    AIService -->|"Generative AI SDK"| GeminiAPI["Google AI Studio (Gemini 1.5 Flash)"]
```

---

## 3. Relational Database Schema (ERD)

```mermaid
erDiagram
    USER ||--o{ COURSE : "creates (Instructor)"
    USER ||--o{ ENROLLMENT : "enrolls (Student)"
    USER ||--o{ QUIZ_ATTEMPT : "takes"
    
    COURSE ||--o{ MODULE : "contains"
    COURSE ||--o{ ENROLLMENT : "has"
    
    MODULE ||--o{ LESSON : "contains"
    MODULE ||--o| QUIZ : "has assessment"
    
    LESSON ||--o{ LESSON_PROGRESS : "tracks"
    
    QUIZ ||--o{ QUESTION : "contains"
    QUIZ ||--o{ QUIZ_ATTEMPT : "records"
    
    QUESTION ||--o{ CHOICE : "has options"
    
    ENROLLMENT ||--o{ LESSON_PROGRESS : "records"
```

---

## 4. Key Capabilities & Features

### 🎓 Dual-Role Access Control (RBAC)
- **Instructors / Educators:**
  - Dedicated **Instructor Studio Dashboard** (`/instructor`) with real-time analytics (Total Courses, Total Enrollments, Total Lessons).
  - Full CRUD operations to create, edit, draft, publish, and delete courses.
  - Interactive **Module & Lesson Builder** supporting rich markdown notes, video embed URLs, and duration estimates.
  - **Assessment Studio:** Author scored multiple-choice questions with answer explanations.
  - **AI Syllabus Builder:** Enter a topic (e.g. "Distributed Systems in Go") and generate a complete multi-tier course outline in seconds.
  - **AI Quiz Generator:** Auto-draft 3-5 assessment questions with answer keys directly from lesson notes.
- **Students / Learners:**
  - **Course Catalog (`/courses`):** Live search, category filtering pills, and difficulty level filters.
  - **One-Click Enrollment:** Instant enrollment into any published curriculum.
  - **Student Learning Portal (`/learn/[slug]`):** Responsive workspace with curriculum tree, checkmarks, video player, and formatted markdown notes.
  - **In-Lesson AI Tutor:** Embedded chat assistant grounded in the lesson content.
  - **Interactive Quiz Engine:** Instant auto-grading, pass/fail thresholds, and question-by-question rationale breakdown.
  - **My Learning Dashboard (`/my-learning`):** Track progress percentages across all enrolled courses.

---

## 5. Reviewer Demo Credentials

Pre-seeded accounts are available for instant testing:

| Persona | Email | Password | Role | Access Scope |
|---|---|---|---|---|
| **Instructor** | `instructor@eduflow.ai` | `Password123!` | `INSTRUCTOR` | Course Studio, AI Syllabus Builder, Quiz Authoring, Analytics |
| **Student** | `student@eduflow.ai` | `Password123!` | `STUDENT` | Catalog, Course Enrollment, Lesson Workspace, AI Tutor, Quizzes |

*(The Sign In page includes Quick 1-Click Demo Auto-Fill buttons for effortless testing).*

---

## 6. Local Development & Setup Guide

### Prerequisites:
- Node.js 18+ or 20+
- PostgreSQL database (or free cloud database from [Neon.tech](https://neon.tech))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/prahul25/house_of_edtech.git
cd house_of_edtech
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set the following variables:
```env
DATABASE_URL="postgresql://user:password@ep-host.region.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-super-secret-jwt-key-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="AIzaSy..." # Optional: free from Google AI Studio
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Automated Testing Suite

EduFlow AI includes automated verification covering Zod schemas, input sanitization, and cryptographic JWT sessions:

```bash
npm test
```

Output:
```text
🚀 Running EduFlow AI Validation & Auth Test Suite...
--- Test Group 1: Auth Validation ---
✅ PASS: Valid sign-in payload should pass
✅ PASS: Invalid email and short password should fail
✅ PASS: Valid instructor sign-up payload should pass

--- Test Group 2: Course Validation ---
✅ PASS: Valid course schema should pass
✅ PASS: Invalid course slug format should fail

--- Test Group 3: Quiz & Assessment Validation ---
✅ PASS: Valid quiz with questions and choices should pass

--- Test Group 4: Cryptographic JWT Auth Token ---
✅ PASS: JWT token should sign successfully
✅ PASS: Signed JWT token should verify and extract identical session payload
✅ PASS: Tampered JWT token should fail verification gracefully
========================================
Total Tests: 9 | Passed: 9 | Failed: 0
========================================
```

---

## 8. Continuous Integration & Production Deployment

- **GitHub Actions CI (`.github/workflows/ci.yml`):** Runs linting, type checks, Prisma client generation, and the test suite on every push and pull request.
- **Vercel Production Deployment:**
  1. Push to GitHub: `git push origin main`
  2. Import repository in [Vercel](https://vercel.com).
  3. Add environment variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GEMINI_API_KEY`.
  4. Deploy.

---

## 9. Author & Compliance

**Developed by:** Rahulkumar Pali  
**LinkedIn:** [linkedin.com/in/rahulkumarpal25](https://www.linkedin.com/in/rahulkumarpal25/)  
**GitHub:** [github.com/prahul25](https://github.com/prahul25)  
*Submitted for the House of EdTech Fullstack Developer Assignment.*
