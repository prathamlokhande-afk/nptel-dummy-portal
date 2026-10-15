# IIT Madras NPTEL Demo — Impact-First Live Execution Guide (`v1.1.0`)

> **How to Use This Document During the Call**
> Keep this guide open on your second screen. The demo is ordered strictly from **#1 Highest Engineering Impact → #6**, so within the **first 12 minutes** you showcase Antigravity's most powerful capabilities (**Always-On Domain Rules + Parallel Subagents + Full-Stack Feature Delivery + Autonomous `/browser` Visual Debugging**) on top of the live **`https://nptel.ac.in/`** replica at `http://localhost:5173/`.

---

## ⚡ 0. Pre-Call Checklist (2 Minutes Before Joining)

| Resource | URL / Command | Status |
| :--- | :--- | :--- |
| **Frontend (`nptel.ac.in` Replica)** | [http://localhost:5173/](http://localhost:5173/) | Running |
| **Backend API (`Express + TS`)** | [http://localhost:4000/api/health](http://localhost:4000/api/health) | Running |
| **Restore 100% Clean State Anytime** | `npm run demo:clean` | Ready |
| **Stage Live UI Bug for Demo #2** | `npm run demo:stage` | Ready |
| **Run All 10 Unit/API Tests + Validator** | `npm test` | Ready |

---

## 🎬 Opening (Minutes 0–3): Set the Stage with `nptel.ac.in` & SDLC Git History

1. **Show `http://localhost:5173/` in Chrome**:
   - Point out that this is a full-stack replica of **`https://nptel.ac.in/`** built for IIT Madras:
     - Official `60px` top bar (`Initiatives`, `Courses`, `Inspired Learners`, `Exams`, `More`, `#005fff` `Log in`).
     - Dark hero banner (`34+ Lakh Enrollments`), 4 soft-pink impact cards (`1.86B+ Views`, `3200+ courses`, `3.79Cr+ enrollments`, `7900+ LC colleges`), 8 IIT/IISc coordinator crests, `News & Announcements` tabs, interactive Course Catalog (`6 courses`), Classroom with **Bhashini English/Tamil/Hindi transcripts**, **Official 25/75 Best-N Grading Engine**, **QR e-Certificate Verifier**, and **Local Chapter (SPOC) Dashboard**.
2. **Show Terminal (`git log --oneline -n 7`)**:
   - *"We didn't vibe-code this in one giant dump. We used Antigravity across a real 7-stage Software Development Lifecycle: Governance & CI (`a83dab2`) → Architecture & ADR-001 (`1ece8a5`) → Backend API (`5eeda61`) → Automated Tests (`49cf4ae`) → Accessible Frontend (`5d08fd6`) → Official `nptel.ac.in` Alignment (`9adfaf5`). Now let's build new features live on top of it."*

---

## 🏆 Feature Ranking Overview (Highest Impact First)

| Rank | Antigravity Feature Showcased | New NPTEL Feature You Introduce Live | Time | Engineering Impact |
| :--- | :--- | :--- | :--- | :--- |
| **#1 (Highest)** | **Always-On Rules (`.agents/rules/`) + Parallel Subagents (`invoke_subagent`)** | **1-Click Learner Score Scenarios & CSR Fee-Waiver Qualifier** (Full-Stack: Backend + `node:test` + React UI) | 8 mins | **4 hrs → 60 sec**; zero domain rule violations |
| **#2** | **Autonomous `/browser` Agent + Chrome DevTools MCP (`a11y-debugging`)** | **Live Visual Reproduction & Auto-Fix of AICTE FDP + Search Filter Bug** | 6 mins | Eliminates manual browser repro & DevTools context-switching |
| **#3** | **Multimodal Image-to-Code + GIGW 3.0 Accessibility Rules** | **Interactive "What-If Exam Score Slider" & UGC Credit Badge from Wireframe PNG** | 6 mins | Wireframe mockup → WCAG 2.1 AA React code in 1 prompt |
| **#4** | **Custom Workspace Skills (`SKILL.md`) + Deterministic Hooks (`hooks.json`)** | **Onboard New IITM Quantum Computing Course (`noc26-cs07`) with Tamil & Hindi Bhashini Transcripts** | 6 mins | Zero schema errors across 600+ semester courses |
| **#5** | **Spec-First Planning (`/plan` & `/grill-me`)** | **SPOC Local Chapter "Export CSV & At-Risk Filter" on `SpocDashboard.tsx`** | 5 mins | Catches edge cases *before* writing code |
| **#6** | **Security Audit Skill (`nptel-security-checklist`) + `/learn`** | **Automated OWASP & Zero-PII Pre-PR Verification Report** | 4 mins | Automated government & MoE security sign-off |

---

## 🔥 DEMO #1 (HIGHEST IMPACT — RUN FIRST): Full-Stack Feature Delivery with Always-On Domain Rules & Parallel Subagents

### 1. What NPTEL Feature You Are Introducing
**"Interactive Learner Score Scenario Presets & CSR Exam Fee-Waiver Eligibility"** inside the Course Classroom (`25/75 Grading Calculator`):
- **Backend (`gradingService.ts` + `/api/grading/calculate`)**: Compute whether a student qualifies for a **50% CSR Proctored Exam Fee Waiver** (`csrFeeWaiverEligible: true` when `qualifiedForCertificate === true` and `assignmentScoreOut25 >= 18.0`, i.e., `>= 72%` assignment average).
- **Backend Tests (`backend/test/grading.test.ts`)**: Add a unit test verifying CSR fee-waiver calculation and the Dual Qualifying Criterion.
- **Frontend (`CourseClassroom.tsx`)**: Add a **1-Click "Test Learner Scenarios" Bar** at the top of the `Official 25/75 Grading Calculator` tab with 3 real-world NPTEL student cases:
  1. **`🥇 Topper (Elite + Gold + CSR Waiver)`** (`92%` assignments, `94%` exam)
  2. **`⚠️ The Dual-Threshold Trap (96% Exam, 32% Assignments → No Certificate)`** (demonstrates NPTEL's famous rule where scoring `< 10/25` in assignments disqualifies even an exam topper!)
  3. **`🥈 Borderline Silver Contender`** (`80%` assignments, `74%` exam)

### 2. Why This Has the Highest Impact for IIT Madras Developers
In a single workflow, the IIT Madras team sees **three enterprise Antigravity superpowers working together**:
1. **Institutional Memory via `.agents/rules/`**: Open [`.agents/rules/nptel-grading-and-api.md`](../.agents/rules/nptel-grading-and-api.md) and [`.agents/rules/gigw-accessibility.md`](../.agents/rules/gigw-accessibility.md) for 30 seconds first. Show that you don't need to remind the AI about the NPTEL JSON envelope, the Best-N rule (`Best 6 of 8`), or `aria-live="polite"`—it already knows.
2. **Parallel Subagents (`invoke_subagent`)**: Antigravity splits the backend/test work and frontend UI work across subagents concurrently.
3. **Automatic Post-Write Hooks (`.agents/hooks.json`)**: TypeScript (`tsc --noEmit`) and catalog validation run automatically on every file save.

### 3. Exact Step-by-Step Presenter Actions
- **Step 1 (Show Before State)**:
  - On `http://localhost:5173/`, click **`Course Classroom & Grading`** in the sub-bar, then click the **`Official 25/75 Grading Calculator`** tab. Show the 8 weekly assignment inputs and exam score input.
  - Briefly open [`.agents/rules/nptel-grading-and-api.md`](../.agents/rules/nptel-grading-and-api.md) in the editor so the audience sees how domain rules are codified.
- **Step 2 (Copy-Paste This Prompt into Antigravity)**:
  ```text
  We want to introduce a full-stack feature for the 25/75 Grading Calculator using parallel subagents where appropriate:
  1. Backend & Tests: In `backend/src/services/gradingService.ts` (and `frontend/src/types/nptel.ts`), add `csrFeeWaiverEligible: boolean` to `GradingResult` (true when `qualified === true` and `assignmentScoreOut25 >= 18`). Add a unit test for `csrFeeWaiverEligible` in `backend/test/grading.test.ts` and verify `npm test` passes.
  2. Frontend (`frontend/src/components/CourseClassroom.tsx`): Inside the `Official 25/75 Grading Calculator` tab, add a "Quick Learner Scenario Presets" bar with 3 buttons:
     - "Topper Profile (Elite + Gold)" (sets all assignments to 94 and exam to 92)
     - "Dual-Threshold Trap (96% Exam, 32% Assignments)" (sets all assignments to 32 and exam to 96 — proving `< 10/25` in assignments disqualifies even a 96% exam score!)
     - "Borderline Silver Contender" (sets assignments to 82 and exam to 74)
     Also display a green badge in the result card when `gradingResult.csrFeeWaiverEligible` is true ("Eligible for 50% CSR Exam Fee Waiver"). Ensure GIGW 3.0 accessibility rules are followed.
  ```
- **Step 3 (Verify Live on `http://localhost:5173/`)**:
  - Click the new **"Dual-Threshold Trap (96% Exam, 32% Assignments)"** button live in the browser!
  - Point out how the Proctored Exam bar turns green (`72 / 75 Passed`), the Assignment bar turns red (`8 / 25 < 10.0 minimum`), and the badge immediately announces **`Not Qualified (Below Threshold)`**.
  - Click **"Topper Profile (Elite + Gold)"** and show the **`Elite + Gold`** badge + the new **`Eligible for 50% CSR Exam Fee Waiver`** badge!

---

## 🌐 DEMO #2 (SECOND HIGHEST IMPACT): Autonomous `/browser` Visual Debugging & A11y Verification

### 1. What You Are Demonstrating
How Antigravity uses a **real headless/visible Chrome instance (`/browser` + Chrome DevTools MCP)** to reproduce a subtle frontend filter bug that unit tests and TypeScript compilation miss, trace it to the React component, fix the code, and visually verify the fix in the browser.

### 2. Exact Step-by-Step Presenter Actions
- **Step 1 (Stage the Realistic Bug in 1 Second)**:
  - In your terminal, run:
    ```bash
    npm run demo:stage
    ```
  - Explain to the IIT Madras team: *"Suppose a developer pushed a commit to `CourseCatalog.tsx`. TypeScript compiles cleanly (`0 errors`), and all 10 backend tests pass. But a faculty member reports that searching for a course while filtering by AICTE FDP returns 0 results."*
- **Step 2 (Copy-Paste This Prompt into Antigravity)**:
  ```text
  /browser Open http://localhost:5173/, scroll to the Jul–Nov 2026 Certification Courses catalog, type "Python" into the search box, and check the "Show only AICTE Approved FDP Courses" checkbox.
  Notice a bug: it says "Showing 0 of 6 Jul–Nov 2026 Courses" even though noc26-cs01 (Python) is AICTE FDP approved!
  Inspect `frontend/src/components/CourseCatalog.tsx`, identify and fix the filter bug, and then re-verify in the browser that searching "Python" with "AICTE Approved FDP" checked displays `noc26-cs01` ("Showing 1 of 6").
  ```
- **Step 3 (What the IIT Madras Team Sees)**:
  - The **`browser` subagent** opens `http://localhost:5173/`, types `"Python"`, checks the checkbox, observes `Showing 0 of 6`, pinpoints line 54 of `CourseCatalog.tsx` (`DEMO BUG HOOK #3`), fixes the boolean logic, and confirms `Showing 1 of 6 Jul–Nov 2026 Courses` in Chrome!

---

## 🎨 DEMO #3 (THIRD HIGHEST IMPACT): Multimodal Wireframe-to-Code (Image → Accessible React UI)

### 1. What NPTEL Feature You Are Introducing
**"Interactive What-If Proctored Exam Slider & UGC Credit Transfer Readiness Card"** inside the **`Exam Medal Target Simulator`** tab of `CourseClassroom.tsx`, generated directly from a product wireframe image ([`demo-assets/medal-simulator-wireframe.png`](../demo-assets/medal-simulator-wireframe.png)).

### 2. Exact Step-by-Step Presenter Actions
- **Step 1 (Show the Wireframe Image)**:
  - Open [`demo-assets/medal-simulator-wireframe.png`](../demo-assets/medal-simulator-wireframe.png) in the IDE so the IIT Madras team sees the visual mockup card.
- **Step 2 (Attach `@demo-assets/medal-simulator-wireframe.png` and Paste This Prompt)**:
  ```text
  Look at the design in @demo-assets/medal-simulator-wireframe.png.
  In `frontend/src/components/CourseClassroom.tsx` inside the `Exam Medal Target Simulator` (`activeSubTab === 'simulator'`) view, add an interactive "What-If Exam Day Score Slider" (range 0 to 100) right above the 4 target medal cards.
  As the learner drags the slider, highlight which of the 4 medal tiers (`Successfully Completed`, `Elite`, `Elite + Silver`, `Elite + Gold`) they would unlock on exam day given their current Best-N assignment score, and show their projected Final Composite Score out of 100 using a semantic `<progress>` bar and `aria-live="polite"`.
  ```
- **Step 3 (Verify Live on `http://localhost:5173/`)**:
  - Open **`Course Classroom & Grading` → `Exam Medal Target Simulator`** and drag the new **What-If Exam Day Slider** from `40%` → `75%` → `95%`, watching the 4 medal cards light up dynamically!

---

## 🛠️ DEMO #4 (FOURTH HIGHEST IMPACT): Custom Team Skills + Automatic Validation Hooks (`nptel-course-ingestor`)

### 1. What NPTEL Feature You Are Introducing
Onboarding a brand-new **Jul–Nov 2026 IIT Madras Course (`noc26-cs07`: *Introduction to Quantum Computing and Quantum Information* by Prof. Prabha Mandayam)** with **English, Tamil (`தமிழ்`), and Hindi (`हिन्दी`) Bhashini lecture transcripts** and automatic schema validation.

### 2. Exact Step-by-Step Presenter Actions
- **Step 1 (Show the Skill & Validator)**:
  - Open [`.agents/skills/nptel-course-ingestor/SKILL.md`](../.agents/skills/nptel-course-ingestor/SKILL.md) and [`validate-course.mjs`](../.agents/skills/nptel-course-ingestor/scripts/validate-course.mjs).
  - Explain: *"Every semester, IIT Madras onboards 600+ courses. Instead of writing long prompts every time, your team packages the exact SWAYAM schema and Bhashini requirements into a reusable Skill."*
- **Step 2 (Copy-Paste This Prompt into Antigravity)**:
  ```text
  Use our `nptel-course-ingestor` skill to onboard a new 8-week course into `backend/src/data/courses.json`:
  - Code: `noc26-cs07`
  - Title: "Introduction to Quantum Computing and Quantum Information"
  - Instructor: "Prof. Prabha Mandayam"
  - Institute: "IIT Madras"
  - Discipline: "Computer Science & Engineering"
  - Duration: 8 weeks (2 credits), AICTE FDP Approved, Exam Date: "2026-11-15 (09:00 IST)", 44,200 enrollments, 83% completion rate.
  - Include Week 1–8 syllabus modules and authentic English, Tamil (`ta`), and Hindi (`hi`) Bhashini transcript segments for Week 1 covering Qubits, Superposition, and Dirac Bra-Ket notation.
  Run the course validator script to confirm 100% schema compliance.
  ```
- **Step 3 (Verify Live on `http://localhost:5173/`)**:
  - Switch to the `Course Catalog` tab on `http://localhost:5173/`: point out the counter now reads **`Showing 7 of 7 Jul–Nov 2026 Courses`**.
  - Click **`Enter Classroom`** on **Introduction to Quantum Computing (`NOC26-CS07`)** and toggle the transcript pills between **English**, **Tamil (`தமிழ்`)**, and **Hindi (`हिन्दी`)**!

---

## 🧠 DEMO #5 (FIFTH HIGHEST IMPACT): Spec-First Planning (`/plan` & `/grill-me`) for Local Chapter (SPOC) Analytics

### 1. What NPTEL Feature You Are Introducing
**"SPOC College Search, Tier Badge Filter & 1-Click CSV Report Download"** on the **Local Chapters (SPOC)** dashboard (`SpocDashboard.tsx`).

### 2. Exact Step-by-Step Presenter Actions
- **Step 1 (Show `Local Chapters (SPOC)` on `http://localhost:5173/`)**:
  - Click **`Local Chapters (SPOC)`** in the navigation bar to show the 5 Local Chapter colleges (`CEG Anna University`, `PSG Tech`, `COEP Pune`, `RVCE Bengaluru`, `JNTU Hyderabad`).
- **Step 2 (Copy-Paste This Prompt into Antigravity)**:
  ```text
  In `frontend/src/components/SpocDashboard.tsx`, add:
  1. A search input (`<label htmlFor="spoc-college-search">`) to filter Local Chapter colleges by college name, city, or SPOC code (e.g., `LC-TN-0014`).
  2. An "Export Filtered Chapters to CSV" button that generates and downloads a clean `.csv` file of the currently displayed Local Chapters for IIT Madras SPOC coordinators.
  Ensure GIGW 3.0 accessibility compliance.
  ```
- **Step 3 (Verify Live)**:
  - Filter by `Anna University` or `Tamil Nadu` and click **`Export Filtered Chapters to CSV`**!

---

## 🛡️ DEMO #6 (CLOSING IMPACT): Automated OWASP & Government Security Audit (`nptel-security-checklist`) + `/learn`

### 1. What You Are Demonstrating
How IIT Madras can enforce **pre-PR security & zero-PII audits** across all Express API routes using a dedicated security skill ([`.agents/skills/nptel-security-checklist/SKILL.md`](../.agents/skills/nptel-security-checklist/SKILL.md)).

### 2. Exact Step-by-Step Presenter Actions
- **Step 1 (Copy-Paste This Prompt into Antigravity)**:
  ```text
  Run the `nptel-security-checklist` skill across `backend/src/routes/` and `backend/src/services/gradingService.ts`. Verify that:
  1. All `:id` and `:certId` parameters enforce strict regex validation before lookup.
  2. Grading payloads reject out-of-bounds scores (< 0 or > 100) and non-array inputs with HTTP 400 and standard `NPTEL_ERR_*` codes.
  3. Zero sensitive learner PII (phone numbers, emails, Aadhaar) is exposed in `/api/certificates` or `/api/spoc/analytics`.
  Output a concise Pre-PR Security Sign-Off table matching `.github/pull_request_template.md`.
  ```
- **Step 2 (Mention `/learn` as Your Closing Takeaway)**:
  - Tell the IIT Madras team: *"Whenever a senior architect corrects an edge case or establishes a new coding convention during a sprint, you simply type `/learn` in Antigravity, and the agent distills that lesson into `.agents/rules/` or `.agents/skills/` so the entire IIT Madras engineering team benefits from that knowledge forever."*
