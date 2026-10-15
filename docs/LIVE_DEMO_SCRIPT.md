# IIT Madras NPTEL Engineering Team — Live Developer Demo Runbook (`v1.1.0`)

**Starting Point**: The running **`https://nptel.ac.in/`** replica portal (`http://localhost:5173/` + `http://localhost:4000/`) with a 7-commit SDLC Git history (`v1.1.0`).  
**Target Audience**: Senior Full-Stack, Backend, QA, and DevOps Engineers building NPTEL / SWAYAM at IIT Madras (IC&SR Building).  
**Core Narrative**: *"How an IIT Madras NPTEL developer uses Google Antigravity across a complete sprint—from onboarding a new semester course to shipping a full-stack feature, catching an accessibility/UI bug in a real browser, and auditing OWASP security before opening a PR."*

---

## Pre-Flight Commands (2 Minutes Before Joining the Call)

```bash
# 1. Ensure both Frontend (:5173) and Backend (:4000) dev servers are running:
npm run dev

# 2. Optional: Stage the live demo bug hook in CourseCatalog.tsx (for Act 5 Browser Debugging)
#    or restore 100% clean state anytime:
npm run demo:stage   # injects the subtle AICTE + search filter regression for Act 5
npm run demo:clean   # restores 100% passing state
```

- **Frontend URL**: `http://localhost:5173/`
- **Backend API URL**: `http://localhost:4000/api/health`

---

## Part 0: Opening Tour of the `nptel.ac.in` Starting Point (Minutes 0–4)

1. **Show the Live Portal (`http://localhost:5173/`)**:
   - Point out the exact **`https://nptel.ac.in/`** visual architecture:
     - `60px` white top navbar (`Initiatives ▾`, `Courses ▾`, `Inspired Learners ▾`, `Exams`, `More ▾`, and `#005fff` `Log in`).
     - Full-bleed dark hero banner (`34+ Lakh Enrollments in July 2026 Semester!`), the 4 signature soft-pink impact cards (`1.86B+ Views`, `3200+ courses`, `3.79Cr+ enrollments`, `7900+ LC colleges`), the 8 IIT/IISc Coordinator crests, and the `News & Announcements` tabs (`#1c93ed`).
     - Interactive **SWAYAM – NPTEL Course Catalog**, **Classroom with Bhashini Regional Transcripts (English / Tamil / Hindi)**, **Official 25/75 Best-N Grading Calculator**, **QR e-Certificate Verifier**, and **Local Chapter (SPOC) Dashboard**.
2. **Show the SDLC Git History (`git log --oneline`)**:
   - Show the team that this wasn't built as a "single messy AI dump"—it follows a 7-stage engineering lifecycle (`chore(init)` → `docs(architecture)` + `ADR-001` → `feat(backend)` → `test(backend)` → `feat(frontend)` → `docs(demo)` → `feat(frontend): official nptel.ac.in alignment`).

---

## Act 1: Codifying IIT Madras Institutional Memory (`GEMINI.md`, `.agents/rules/`, `.agents/hooks.json`) (Minutes 4–10)

### Developer Pain Point at NPTEL
Every time a new developer, project associate, or intern joins the IIT Madras NPTEL team, they have to memorize:
- *Why does an 8-week course take the **Best 6 of 8** assignments while a 12-week course takes the **Best 8 of 12**?*
- *Why did a student with `70/75` in the proctored exam still fail?* (Because `assignmentScoreOut25 < 10.0` violates the Dual Qualifying Criterion).
- *What GIGW 3.0 & WCAG 2.1 AA accessibility rules must every government educational portal follow?*

### What You Do Live in Antigravity
1. Open [`GEMINI.md`](../GEMINI.md), [`.agents/rules/nptel-grading-and-api.md`](../.agents/rules/nptel-grading-and-api.md), and [`.agents/rules/gigw-accessibility.md`](../.agents/rules/gigw-accessibility.md).
2. Explain **Always-On Workspace Rules**: Unlike wiki pages that go stale, `.agents/rules/*.md` are automatically injected into every developer's agent context whenever they touch `backend/src/**` or `frontend/src/**`.
3. Open [`.agents/hooks.json`](../.agents/hooks.json) and show **Deterministic Guardrails**:
   - Every time the agent edits a file (`post_write_code`), Antigravity automatically runs `node .agents/skills/nptel-course-ingestor/scripts/validate-course.mjs` and TypeScript typechecking (`tsc --noEmit`).
4. **Live Prompt to Run**:
   > *"Check our `.agents/rules/` and explain what would happen if a developer accidentally changed the 8-week assignment calculation in `gradingService.ts` to average all 8 weeks instead of Best 6 of 8."*

---

## Act 2: Zero-Error Semester Operations with Custom Skills (`nptel-course-ingestor`) (Minutes 10–17)

### Developer Pain Point at NPTEL
Every semester (`Jan–Apr` and `Jul–Nov`), the IIT Madras team onboards hundreds of new courses across 7 IITs and IISc into the catalog, attaching AICTE FDP metadata, UGC credit mappings, and Bhashini regional transcripts (English, Tamil, Hindi). One malformed course code (`cs09` instead of `noc26-cs09`) or missing language key breaks downstream UI views.

### What You Do Live in Antigravity
1. Open [`.agents/skills/nptel-course-ingestor/SKILL.md`](../.agents/skills/nptel-course-ingestor/SKILL.md) and its validator script [`validate-course.mjs`](../.agents/skills/nptel-course-ingestor/scripts/validate-course.mjs).
2. Show how a **Skill** combines domain instructions (`SKILL.md`) with executable validation scripts (`scripts/`).
3. **Live Prompt to Run**:
   > *"Use our `nptel-course-ingestor` skill to onboard a new 8-week Jul–Nov 2026 course from IIT Madras (`noc26-cs07`): 'Introduction to Quantum Computing and Quantum Information' taught by Prof. Prabha Mandayam (2 credits, AICTE FDP approved, 42,500 enrollments). Include Week 1–8 modules and English, Tamil, and Hindi Bhashini transcript segments for Week 1, then run the catalog validator script."*
4. **What the IIT Madras Team Sees on Screen**:
   - Antigravity reads `SKILL.md`, appends `noc26-cs07` to `backend/src/data/courses.json`, runs `validate-course.mjs` (`7 courses compliant`), and `http://localhost:5173/` immediately shows **`Showing 7 of 7 Jul–Nov 2026 Courses`** with working Tamil & Hindi transcripts in the classroom!

---

## Act 3: Spec-First Feature Engineering & Multimodal UI-to-Code (`/plan`, `/grill-me`, Image-to-Code) (Minutes 17–27)

### Developer Pain Point at NPTEL
Before proctored exams, lakhs of students email NPTEL support asking: *"I scored X in my weekly assignments—how much do I need in Sunday's proctored exam to get an Elite + Silver or Elite + Gold medal?"*
Suppose the product designer hands you a UI wireframe PNG ([`demo-assets/medal-simulator-wireframe.png`](../demo-assets/medal-simulator-wireframe.png)) and says: *"Build this interactive What-If Slider & Target Export card inside the Classroom view."*

### What You Do Live in Antigravity
1. Show how a senior developer uses **`/grill-me`** or **`/plan`** before writing a single line of code so edge cases (like when `90 - assignmentScoreOut25 > 75`, making `Elite + Gold` mathematically impossible even with `100%` on the exam!) are caught at design time.
2. Drag-and-drop [`demo-assets/medal-simulator-wireframe.png`](../demo-assets/medal-simulator-wireframe.png) into the Antigravity chat and run:
   > *"Look at `@demo-assets/medal-simulator-wireframe.png`. In `CourseClassroom.tsx` under the `Exam Medal Target Simulator` tab, add a 'Quick Preset Profile' bar ('Topper Profile', 'Borderline Assignment Profile (9.5/25)', 'Silver Contender') so learners can 1-click test how the Dual Qualifying Criterion affects their required exam score."*
3. Show how Antigravity updates the React component while preserving GIGW 3.0 accessibility (`aria-live="polite"`, semantic `<progress>`, explicit labels).

---

## Act 4: Parallel Subagent Orchestration (`invoke_subagent`) (Minutes 27–35)

### Developer Pain Point at NPTEL
When building a cross-cutting feature—say, adding **CSR Exam Fee Waiver Analytics** to the SPOC Local Chapter API (`backend/`), writing `node:test` integration tests (`backend/test/`), and updating the SPOC table (`frontend/`)—doing it sequentially in one context window is slow and mixes concerns.

### What You Do Live in Antigravity
1. Show how Antigravity spawns **specialized subagents in parallel**:
   - **Subagent 1 (`research` or Backend Engineer)**: Updates the Express route & data layer.
   - **Subagent 2 (`Backend QA & Test Engineer`)**: Writes and runs `node:test` HTTP integration assertions (`npm test`).
   - **Subagent 3 (`browser` subagent)**: Verifies the rendered UI in Chrome.
2. **Live Prompt to Run**:
   > *"Spawn two subagents in parallel: have one subagent add a `?minGold=` filter query parameter to `GET /api/spoc/analytics` in `backend/src/routes/spoc.ts`, and have a second QA subagent add an integration test for `GET /api/spoc/analytics?minGold=20` in `backend/test/api.test.ts` and run `npm test`."*

---

## Act 5: Live Visual & Accessibility Debugging with `/browser` + Chrome DevTools MCP (Minutes 35–42)

### Developer Pain Point at NPTEL
Unit tests pass, TypeScript compiles, yet a subtle frontend filter bug or WCAG accessibility violation slips into production on `nptel.ac.in`.

### What You Do Live in Antigravity
1. Run `npm run demo:stage` in the terminal (which injects the subtle 1-line filter bug into `CourseCatalog.tsx` where searching `Python` while toggling `AICTE FDP` inverts the boolean check).
2. **Live Prompt to Run with `/browser`**:
   > *"/browser Open `http://localhost:5173/`, type `Python` in the course search box, and check the `Show only AICTE Approved FDP Courses` checkbox. Notice that `noc26-cs01` disappears even though it is AICTE FDP approved! Inspect the component, find the bug in `CourseCatalog.tsx`, fix it, and verify in the browser that `noc26-cs01` remains visible."*
3. Watch the `browser` subagent open `http://localhost:5173/`, reproduce the bug visually, pinpoint line 52 of `CourseCatalog.tsx`, fix the boolean logic, and re-verify in Chrome!

---

## Act 6: Pre-Release OWASP & PII Security Audit (`nptel-security-checklist`) (Minutes 42–48)

### Developer Pain Point at NPTEL
Public endpoints like `/api/certificates/:certId/verify` and `/api/spoc/analytics` are scraped by bots and handle student roll numbers and academic scores.

### What You Do Live in Antigravity
1. Open [`.agents/skills/nptel-security-checklist/SKILL.md`](../.agents/skills/nptel-security-checklist/SKILL.md).
2. **Live Prompt to Run**:
   > *"Run our `nptel-security-checklist` skill across `backend/src/routes/` to audit input validation, regex strictness on `noc26-*` and certificate IDs, and ensure zero student PII (Aadhaar/phone/email) is exposed in API responses."*
3. Wrap up by showing `git status`, `git diff`, and the PR checklist in [`.github/pull_request_template.md`](../.github/pull_request_template.md).
