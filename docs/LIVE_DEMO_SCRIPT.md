# Presenter Runbook: IIT Madras (NPTEL Dev Team) Live Demo

This runbook contains your **exact minute-by-minute flow, file links, keyboard shortcuts, and copy-paste prompts** for the live session with the IIT Madras NPTEL engineering team.

---

## Pre-Flight Setup (2 Minutes Before Call)

1. Start both the Backend (`:4000`) and Frontend (`:5173`):
   ```bash
   npm run dev
   ```
2. Open `http://localhost:5173` in Chrome to show the running **NPTEL Online Certification Portal**.
3. If you want to stage the intentional filter bug for Act 4, run:
   ```bash
   npm run demo:stage-hooks
   ```
   *(And if you ever want to restore the 100% clean state during the call, run `npm run demo:clean`.)*

---

## Opening Hook (2 Mins): Tour the NPTEL Portal
Show the IITM team that you built an authentic replica of their world:
- **Course Catalog**: Flagship IIT Madras courses (*Prof. Madhavan Mukund's Python/DSA*, *Prof. Mitesh Khapra's Deep Learning*, *Prof. Balaraman Ravindran's ML*), AICTE FDP badges, and Duration filters (`4W / 8W / 12W`).
- **Course Classroom**: Click **Enter Classroom** on *Programming, Data Structures and Algorithms using Python* (`noc26-cs01`). Click **தமிழ் (Bhashini)** and **हिन्दी (Bhashini)** to show synchronized regional lecture transcripts, then click **Official 25/75 Grading Calculator** and **Exam Medal Target Simulator**.
- **Verify e-Certificate & Local Chapters (SPOC)**: Click through the top navigation tabs to show verifiable QR certificates (`NPTEL26CS01S1049201`) and the Local Chapter leaderboard (CEG Anna University, PSG Tech, COEP, RVCE).

---

## Act 1 (8 Mins): High-Velocity Inner Loop in Antigravity IDE
**Goal**: Show how Antigravity accelerates the 200 small edits developers make every day—before even using autonomous agents.

1. Open [`backend/src/services/gradingService.ts`](../backend/src/services/gradingService.ts).
2. **Antigravity Tab, Supercomplete & Tab-to-Jump**:
   - Place your cursor inside `getBestAssignmentCount` or `calculateNptelGrade`.
   - Start typing a comment or a helper for `topperRank` (e.g., `// Award Top 1% topper badge if totalScoreOut100 >= 95`).
   - Show how **Supercomplete** proposes the multi-line implementation, **Tab-to-Jump** predicts the next edit location in the return object, and **Tab-to-Import** auto-imports missing symbols.
3. **Instructive Inline Edit (`⌘+I` / `Ctrl+I`)**:
   - Highlight the `calculateNptelGrade` function body, press **`⌘+I`**, and paste:
     > `Add a 'graceMarksApplied: boolean' field that boosts examScoreOut75 from 29.5 to 30.0 if the student scored >= 22/25 in assignments, and update the explanation string.`
   - Point out the **Inline Red/Green Visual Diff Overlay**—accept or reject right in the editor.
4. **Inline Code Lenses**:
   - Click the **"Write Tests"** or **"Explain"** Code Lens right above `calculateNptelGrade`.

---

## Act 2 (12 Mins): From Faculty Spec + Wireframe to Full-Stack Feature (`/plan`, `@`, Media, Artifacts)
**Goal**: Show how Antigravity plans and executes multi-file full-stack features safely.

1. In the Chat Canvas, drag and drop [`demo-assets/medal-simulator-wireframe.png`](../demo-assets/medal-simulator-wireframe.png).
2. Copy-paste this prompt with `@` mentions:
   > `/plan Using @backend/src/routes/courses.ts and @frontend/src/components/CourseClassroom.tsx, add a "Download Hall Ticket & Exam Center Preview" modal inside the Exam Medal Target Simulator tab. Include candidate roll number, IST exam session timing (09:00 AM / 02:00 PM IST), assigned exam city (Chennai / Bengaluru / Pune / Mumbai), and a backend endpoint GET /api/courses/:id/hall-ticket-preview that follows our NPTEL API response standards.`
3. **Highlight to IITM Engineers**:
   - Antigravity generates an **Implementation Plan Artifact** with a Mermaid diagram and clickable file links.
   - Tech leads can review and refine the plan *before* code is written.
   - Click **Proceed** and highlight the **Terminal Sandbox** running `npm test` automatically to verify nothing broke.

---

## Act 3 (12 Mins): Encoding IIT Madras Team Standards in Git (`.agents/`)
**Goal**: Show how IIT Madras can onboard new project staff, interns, and full-time developers with zero ramp-up friction.

1. **Hierarchical Workspace Rules (`GEMINI.md` & `.agents/rules/`)**:
   - Open [`GEMINI.md`](../GEMINI.md), [`.agents/rules/nptel-grading-and-api.md`](../.agents/rules/nptel-grading-and-api.md), and [`.agents/rules/gigw-accessibility.md`](../.agents/rules/gigw-accessibility.md).
   - Point out how `nptel-grading-and-api.md` enforces the `{ success, nptelMeta, data }` JSON envelope and `noc26-*` course ID validation, while `gigw-accessibility.md` enforces Government of India (GIGW 3.0 / WCAG 2.1 AA) accessibility rules.
   - Copy-paste this short prompt (notice you don't mention `nptelMeta` or error codes!):
     > `Add a GET /api/courses/:id/transcripts/:lang endpoint to fetch only a specific regional language transcript (en, ta, or hi) across all weeks of a course.`
   - Show the audience that Antigravity **automatically** wrapped the response in `sendNptelSuccess` with `nptelMeta` and validated `noc26-*` because of the workspace rule!
2. **Progressive-Disclosure Custom Skills (`.agents/skills/`)**:
   - Open [`.agents/skills/nptel-course-ingestor/SKILL.md`](../.agents/skills/nptel-course-ingestor/SKILL.md).
   - Explain **Progressive Disclosure**: Antigravity only loads the skill's full instructions and scripts when needed, keeping token usage lean.
   - Copy-paste this prompt:
     > `Onboard a new 12-week AICTE FDP course by Prof. V. Kamakoti (IIT Madras) titled "Computer Architecture and RISC-V Processor Design" (noc26-cs07) into our catalog with English, Tamil, and Hindi Week 1 transcripts.`
   - Watch Antigravity read `SKILL.md`, update `courses.json`, and automatically run `node .agents/skills/nptel-course-ingestor/scripts/validate-course.mjs`!
3. **Lifecycle Hooks (`.agents/hooks.json`) & `/learn`**:
   - Open [`.agents/hooks.json`](../.agents/hooks.json) to show how `validate-course.mjs` runs automatically whenever `courses.json` is written.
   - Explain **`/learn`**: Whenever a senior IITM engineer corrects the agent once in chat, typing `/learn` saves that institutional knowledge into a reusable rule or skill.

---

## Act 4 (10 Mins): Browser Verification, Accessibility & Generative UI
**Goal**: Show visual debugging, WCAG accessibility auditing, and inline interactive visualizations.

1. **Generative UI (Inline Interactive Chart in Chat)**:
   - Copy-paste this prompt:
     > `Render an interactive visual dashboard right here in the chat comparing our Jul-Nov 2026 courses by enrollment count, completion rate, and AICTE FDP status, including an interactive slider to simulate how a 15% enrollment surge impacts exam center capacity.`
2. **Browser Automation & Accessibility (`/browser`)**:
   - If you ran `npm run demo:stage-hooks`, copy-paste:
     > `Users reported that checking "Show only AICTE Approved FDP Courses" while searching for "Python" in @frontend/src/components/CourseCatalog.tsx returns 0 courses. Find and fix the bug, and verify our filter controls meet GIGW/WCAG accessibility standards.`

---

## Act 5 (10 Mins): Parallel Subagents & Power Slash Commands
**Goal**: Show how 1 engineer can orchestrate 3 specialized subagents simultaneously before Exam Results Day.

1. Copy-paste this multi-agent prompt:
   > `Launch 3 subagents in parallel to prepare our portal for NPTEL Exam Results Day:`
   > `1. Security Auditor Subagent: Use our nptel-security-checklist skill to audit backend/src/routes/certificates.ts and backend/src/routes/grading.ts for input validation or enumeration risks.`
   > `2. Test Engineer Subagent: Add unit tests in backend/test/grading.test.ts covering 4-week and 12-week courses and boundary scores (39.4 vs 39.5).`
   > `3. Documentation Subagent: Generate an API endpoint reference table for our SPOC college partners.`
2. Open the **Auxiliary Pane → Subagents** in Antigravity 2.0 so the IITM team can watch all 3 subagents executing concurrently and reporting back!
3. **Quick Tour of Power Slash Commands**:
   - **`/grill-me`**: Stress-tests your architecture plan through an interactive Q&A interview before writing code.
   - **`/boost`**: Activates deep multi-perspective reasoning and rigorous verification for complex bugs.
   - **`/schedule`**: Sets up recurring background jobs (e.g., checking broken video links or summarizing newly filed issues every morning at 9 AM IST).
