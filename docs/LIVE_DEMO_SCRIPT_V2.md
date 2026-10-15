# IIT Madras (NPTEL Portal) — Antigravity Live Demo & Day-to-Day Engineering Playbook (Version 2.0)

> **Document Version**: `v2.0 (Comprehensive Enterprise Edition)`
> **Target Audience**: IIT Madras NPTEL Development, Platform Architecture, Bhashini Translation, & DevOps Teams
> **Live Frontend (`https://nptel.ac.in/` Official UI Clone)**: `http://localhost:5173/`
> **Live Backend API (`Express + TypeScript`)**: `http://localhost:4000/api/health`
> **Ordering Principle**:
> - **Part I (Demos #1 → #6)**: Core High-Impact Features ordered strictly from **#1 Highest Immediate Engineering Impact** down to **#6**.
> - **Part II (Demos #7 → #12)**: **Complex Enterprise Features, Custom MCP Servers, Multi-Step Pipeline Skills, Lifecycle Hooks, CWV/Memory Profiling, and Autonomous Swarms** for advanced day-to-day engineering at IIT Madras.
> - **Part III**: **Day-to-Day Developer Workflow Playbook** showing how an IIT Madras engineer uses Antigravity from 9:30 AM standup to production release.

---

## 0. Complete Impact & Complexity Matrix (Demos #1 → #12)

| Module | Feature / Skill Showcased | Complexity | Live NPTEL Feature Built / Demonstrated | Day-to-Day Impact for IIT Madras Engineers |
| :--- | :--- | :--- | :--- | :--- |
| **Demo #1 (Run First)** | **Always-On Rules (`GEMINI.md`, `.agents/rules/`) + Parallel Subagents + Post-Edit Hooks** | High | **Full-Stack "1-Click Learner Score Scenario Presets & 50% CSR Fee-Waiver Qualifier"** (including the *Dual-Threshold Trap*: `96%` Exam + `32%` Assign = `No Certificate`) | Eliminates tribal-knowledge bugs across backend + frontend in a single prompt with zero boilerplate prompts. |
| **Demo #2** | **Autonomous `/browser` Agent + Chrome DevTools MCP (`a11y-debugging`)** | High | **Visual Reproduction & Auto-Fix of AICTE FDP + Search Filter Bug (`Showing 0 of 6` → `1 of 6`)** | Replaces 30 mins of manual browser clicking, DevTools inspection, and WCAG contrast checking with a 60-second autonomous loop. |
| **Demo #3** | **Multimodal Wireframe-to-Code (Image Input → GIGW 3.0 React)** | Medium | **Interactive "What-If Exam Day Score Slider" (0–100%) & Dynamic Medal Unlock Highlighter** | Turns Figma/whiteboard mockups from IC&SR product managers into accessible React components in 1 turn. |
| **Demo #4** | **Custom Domain Skill (`nptel-course-ingestor`) + CLI Validator** | Medium | **Zero-Error Onboarding of Course #7 (`noc26-cs07`: Quantum Computing)** with EN/TA/HI Bhashini transcripts | Compresses seasonal onboarding of 400+ IIT/IISc courses from days of JSON wrangling into deterministic 1-minute runs. |
| **Demo #5** | **Spec-First Planning (`/plan` & `/grill-me`)** | Medium | **SPOC Local Chapter College Search & 1-Click CSV Export** | Aligns junior and senior devs on edge cases (CSV escaping, GIGW labels) *before* any code is written. |
| **Demo #6** | **Pre-PR Security Skill (`nptel-security-checklist`) + `/learn`** | Medium | **Automated OWASP Top-10, IDOR & Zero-PII Audit + Institutional Memory** | Automates security reviews before PR merge and permanently captures team corrections via `/learn`. |
| **Demo #7 (Advanced)** | **Custom Stdio MCP Server (`nptel-swayam-mcp`) + Team Plugin (`nptel-enterprise-kit`)** | **Very High** | **Live NEP 2020 Academic Bank of Credits (ABC), Bhashini Readiness & TCS iON Exam Center Capacity Calculator** | Connects the AI agent directly to internal IIT Madras / MoE registries (SWAYAM, ABC, TCS iON) via Model Context Protocol. |
| **Demo #8 (Advanced)** | **Multi-Step Data Pipeline Skill (`nptel-bhashini-sync`)** | **Very High** | **Automated Bhashini Coverage Audit (`te: 0%` → `100%`) + Full-Stack WebVTT (`.vtt`) Closed-Caption Subtitle Endpoint & UI Export** | Automates multilingual transcript QA, preserves technical English terms in regional scripts, and generates `.vtt` caption tracks. |
| **Demo #9 (Advanced)** | **Dynamic Subagent Definition (`define_subagent`) + Branched Parallel Swarms (`Workspace: "branch"`)** | **Very High** | **Multi-Shift Proctored Exam Normalization & Cohort Batch-Grading Engine (`POST /api/grading/batch-simulate`)** | Spawns a custom specialist auditor agent + parallel developer agents to build and stress-test complex statistical grading endpoints. |
| **Demo #10 (Advanced)** | **Deterministic Lifecycle Hooks (`PreToolUse`, `PostToolUse`, `Stop` in `.agents/hooks.json`)** | **Very High** | **Hard-Blocking Destructive Commands (`decision: "deny"`) on Seed Data & Enforcing Post-Edit Catalog Verification** | Gives Principal Architects deterministic, non-bypassable shell guardrails over every command and file edit the agent performs. |
| **Demo #11 (Advanced)** | **Core Web Vitals (`debug-optimize-lcp`) & Memory Leak Debugging (`memory-leak-debugging`)** | **Very High** | **Exam-Result-Day LCP Optimization (`fetchpriority="high"`, `content-visibility: auto`) & Detached DOM Heap Audit** | Ensures `nptel.ac.in` stays fast on rural 3G/4G connections and prevents browser tab crashes during 3-hour video marathons. |
| **Demo #12 (Advanced)** | **Autonomous `/goal` Loops, Scheduled Cron (`/schedule`), & `workflow-skill-creator`** | **High** | **Overnight API Migration, Recurring SPOC Deadline Monitors, and Converting Ad-Hoc Fixes into Reusable Team Skills** | Turns repetitive operational chores and multi-hour refactors into background autonomous workflows. |

---

## 1. Pre-Flight Setup & 1-Command Reset Controls

Before starting the session, ensure the servers are running and keep these 4 helper commands handy:

```bash
# 1. Reset all files to the clean 6-course baseline at any point
npm run demo:clean

# 2. Inject the subtle AICTE FDP + Search bug right before Demo #2
npm run demo:stage

# 3. Run the Bhashini Multilingual Coverage Auditor (for Demo #8)
node .agents/skills/nptel-bhashini-sync/scripts/audit-bhashini-coverage.mjs backend/src/data/courses.json

# 4. Self-test the NPTEL-SWAYAM Custom MCP Server (for Demo #7)
node scripts/mcp/nptel-swayam-mcp-server.mjs --selftest
```

---

# PART I: CORE HIGH-IMPACT LIVE DEMOS (DEMOS #1 → #6)

## Demo #1 (Highest Impact — Run First): Always-On Domain Rules + Parallel Subagents + Post-Edit Hooks

### 1.1 The Feature You Will Introduce Live
**"1-Click Learner Score Scenario Presets & 50% CSR Exam Fee-Waiver Qualifier"** across both backend and frontend:
1. **Backend ([gradingService.ts](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/backend/src/services/gradingService.ts) & [grading.test.ts](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/backend/test/grading.test.ts))**: Add `csrFeeWaiverEligible: boolean` (`true` when `eligible === true` AND `totalScore >= 60`) and `scenarioLabel: string` to the grading engine response, plus unit tests.
2. **Frontend ([CourseClassroom.tsx](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/frontend/src/components/CourseClassroom.tsx))**: Add **3 quick-fill scenario preset pills** above the Weekly Assignment inputs:
   - `Elite + Gold Topper` (fills `95%` assignments, `92%` exam → `93/100`, Gold Medal + CSR Fee Waiver Qualified)
   - `Dual-Threshold Trap (96% Exam / 32% Assign)` (fills `32%` assignments = `8.0/25`, `96%` exam = `72.0/75` → Total `80/100`, **No Certificate** because `8.0/25 < 10.0/25`!)
   - `Borderline Pass (40% Min)` (fills `40%` assignments = `10.0/25`, `40%` exam = `30.0/75` → `40/100`, Successfully Completed)

### 1.2 Step-by-Step Execution
1. Show [GEMINI.md](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/GEMINI.md), [nptel-grading-and-api.md](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/rules/nptel-grading-and-api.md), and [gigw-accessibility.md](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/rules/gigw-accessibility.md) briefly (30 sec) to explain **Always-On Workspace Rules**.
2. Paste this **Sample Prompt** into Antigravity:

```text
We want to add a full-stack "Learner Score Scenario Presets & CSR Exam Fee-Waiver Qualifier" feature to the NPTEL Classroom Simulator.
Use parallel subagents (one for Backend + Unit Tests, one for Frontend UI) to implement:
1. Backend (`backend/src/services/gradingService.ts` and `backend/test/grading.test.ts`):
   - Add `csrFeeWaiverEligible: boolean` to `GradingCalculationResult` (true ONLY if the learner passes the dual qualifying criterion AND achieves `totalScore >= 60`, qualifying for the 50% NPTEL CSR exam fee reimbursement).
   - Add unit tests in `backend/test/grading.test.ts` verifying that a "Dual-Threshold Trap" learner (32% assignments = 8/25, 96% exam = 72/75, raw sum 80) has `eligible: false` and `csrFeeWaiverEligible: false`, while an Elite learner (85% assignments, 80% exam) has `csrFeeWaiverEligible: true`.
2. Frontend (`frontend/src/components/CourseClassroom.tsx` and `frontend/src/types/nptel.ts`):
   - Above the Weekly Assignment Inputs in the Simulator, add 3 accessible quick-preset buttons (`aria-label` compliant):
     a) "Elite + Gold Topper" (sets all weeks to 95, proctored exam to 92%)
     b) "Dual-Threshold Trap (96% Exam / 32% Assign)" (sets all weeks to 32, proctored exam to 96%)
     c) "Borderline Pass (40% Min)" (sets all weeks to 40, proctored exam to 40%)
   - Display a "CSR 50% Exam Fee Reimbursement: Eligible / Not Eligible" status badge inside the simulator result banner (`aria-live="polite"`).
3. Run `npm test` to verify all backend unit tests and frontend build checks pass.
```

3. Click **"Dual-Threshold Trap (96% Exam / 32% Assign)"** live in `http://localhost:5173/` to demonstrate `80/100` -> `No Certificate (Disqualified)`.

---

## Demo #2 (2nd Highest Impact): Autonomous `/browser` Agent + Chrome DevTools MCP (`a11y-debugging`)

### 2.1 Step-by-Step Execution
1. Inject the realistic filter bug in your terminal:
   ```bash
   npm run demo:stage
   ```
2. Paste this **Sample Prompt** into Antigravity:
   ```text
   SPOC coordinators reported a bug on http://localhost:5173/: when they toggle the "AICTE FDP Approved Only" filter pill AND type "Python" in the course search box, the catalog shows "Showing 0 of 6 courses" even though "Programming, Data Structures and Algorithms using Python" (noc26-cs01) is an AICTE FDP Approved course.

   Please:
   1. Use the browser agent to open http://localhost:5173/, reproduce this exact bug visually, and check the ARIA state (`aria-pressed` and `aria-live`) of the filter controls.
   2. Inspect `frontend/src/components/CourseCatalog.tsx` to find the root cause and fix it.
   3. Re-verify in the live browser at http://localhost:5173/ that toggling "AICTE FDP Approved Only" + searching "Python" now displays `noc26-cs01` ("Showing 1 of 6 courses") with zero console errors.
   ```

---

## Demo #3 (3rd Highest Impact): Multimodal Wireframe-to-Code (Image Input → GIGW 3.0 React)

### 3.1 Step-by-Step Execution
1. Attach `@demo-assets/medal-simulator-wireframe.png` and paste this **Sample Prompt**:
   ```text
   Look at the attached UI wireframe `@demo-assets/medal-simulator-wireframe.png`.
   Enhance the NPTEL Certification & Medal Target Simulator in `frontend/src/components/CourseClassroom.tsx` by adding:
   1. A "What-If Exam Day Score Slider" (`<input type="range" min="0" max="100" />`) with an explicit `<label htmlFor="what-if-exam-slider">` and live percentage readout.
   2. Dynamic card highlighting on the 4 Target Tier cards (`Successfully Completed`, `Elite`, `Elite + Silver`, `Elite + Gold`) so whichever tier is unlocked by the current assignment + exam score lights up with an "UNLOCKED" pill badge and semantic `<progress>` bar.
   Ensure full compliance with `.agents/rules/gigw-accessibility.md`.
   ```

---

## Demo #4 (4th Highest Impact): Custom Team Skill (`nptel-course-ingestor`) + CLI Validator

### 4.1 Step-by-Step Execution
1. Paste this **Sample Prompt**:
   ```text
   Use the `nptel-course-ingestor` skill to onboard a new 12-week IIT Madras course into `backend/src/data/courses.json`:
   - Course Code: `noc26-cs07`
   - Title: "Introduction to Quantum Computing and Quantum Information"
   - Instructor: "Prof. Prabha Mandayam"
   - Institute: "IIT Madras"
   - Discipline: "Computer Science and Engineering"
   - Duration: 12 weeks (3 Credits, AICTE FDP Approved, Exam Date: "2026-11-22T09:00:00+05:30")
   - Include Week 1 ("Qubits, Superposition & Bloch Sphere") and Week 2 ("Quantum Gates, Bell States & Entanglement") with realistic English (`en`), Tamil (`ta`), and Hindi (`hi`) Bhashini lecture transcripts.
   Run the skill's validation script after adding the course to confirm zero schema errors.
   ```

---

## Demo #5 (5th Highest Impact): Spec-First Planning (`/plan` & `/grill-me`)

### 5.1 Step-by-Step Execution
1. Paste this **Sample Prompt**:
   ```text
   /plan We need to add two features to `frontend/src/components/SpocDashboard.tsx`:
   1. A text search input (`<label htmlFor="spoc-college-search">`) to filter Local Chapters by College Name or City in addition to the existing State dropdown.
   2. An "Export Filtered Table to CSV" button that downloads the currently visible rows as `nptel-spoc-report-jul-nov-2026.csv` and announces the export status via `aria-live="polite"`.
   Create a concise implementation plan first, then implement and verify the build.
   ```

---

## Demo #6 (6th Highest Impact): Pre-PR Security Audit (`nptel-security-checklist`) + `/learn`

### 6.1 Step-by-Step Execution
1. Paste this **Sample Prompt**:
   ```text
   Run a pre-PR security and compliance audit on `backend/src/routes/grading.ts` and `backend/src/routes/certificates.ts` using our `nptel-security-checklist` skill and `.github/pull_request_template.md`.
   Verify that:
   1. Certificate verification masks learner roll numbers (`NPTEL26****1234`) so no raw student PII is exposed.
   2. Grading inputs strictly reject out-of-range assignment scores (`< 0` or `> 100`) and non-standard course durations.
   Output a structured PASS/FAIL security report ready to paste into our GitHub Pull Request.
   ```

---

# PART II: ADVANCED & COMPLEX ENTERPRISE FEATURES (DEMOS #7 → #12)

These 6 advanced modules are designed specifically for **Senior Architects, Tech Leads, and Platform Engineers at IIT Madras** who want to see how Antigravity handles complex multi-system integrations, multilingual pipelines, custom subagent swarms, deterministic security hooks, and performance profiling.

---

## Demo #7 (Complex Feature): Custom Domain MCP Server (`nptel-swayam-mcp`) & Shareable Team Plugin (`nptel-enterprise-kit`)

### 7.1 Why This Matters Day-to-Day at IIT Madras
NPTEL does not operate in isolation. Every day, IIT Madras engineers must cross-check:
- **UGC / NEP 2020 Academic Bank of Credits (ABC)** credit-transfer rules (`1`, `2`, or `3` credits based on 4/8/12-week duration and contact hours).
- **AICTE Faculty Development Programme (FDP)** gazette equivalency (`Half-Week`, `1-Week`, `1.5-Week` FDP).
- **Bhashini ULCA Translation Readiness** across weekly lecture modules.
- **TCS iON Proctored Exam Center Capacity** across Morning (`09:00–12:00 IST`) and Afternoon (`14:00–17:00 IST`) sessions.

With **Model Context Protocol (MCP)** and **Antigravity Plugins**, IIT Madras can wrap internal microservices or CLI registries into an MCP server ([nptel-swayam-mcp-server.mjs](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/scripts/mcp/nptel-swayam-mcp-server.mjs)) bundled inside [`.agents/plugins/nptel-enterprise-kit/`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/plugins/nptel-enterprise-kit/plugin.json).

### 7.2 Architecture Already Built in Your Repo
- **MCP Server**: [scripts/mcp/nptel-swayam-mcp-server.mjs](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/scripts/mcp/nptel-swayam-mcp-server.mjs) exposing 3 JSON-RPC 2.0 tools:
  1. `lookup_abc_credit_mapping`
  2. `check_bhashini_translation_status`
  3. `simulate_exam_center_capacity`
- **Plugin Bundle**: [`.agents/plugins/nptel-enterprise-kit/plugin.json`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/plugins/nptel-enterprise-kit/plugin.json) + [`mcp_config.json`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/plugins/nptel-enterprise-kit/mcp_config.json).

### 7.3 End-to-End Live Execution Guide
1. **Step 1 (Show the MCP Server in Terminal — 30 sec)**:
   Run the self-test command so the IIT Madras team sees the exact JSON-RPC tool outputs:
   ```bash
   node scripts/mcp/nptel-swayam-mcp-server.mjs --selftest
   ```
2. **Step 2 (Copy-Paste Prompt to Build a Full-Stack NEP 2020 ABC Credit & Exam Center Capacity Panel)**:
   ```text
   Run `node scripts/mcp/nptel-swayam-mcp-server.mjs --selftest` and inspect `scripts/mcp/nptel-swayam-mcp-server.mjs` to see our official UGC NEP 2020 Academic Bank of Credits (ABC) mapping and TCS iON Exam Shift allocation rules.

   Now expose this logic in our portal:
   1. Backend (`backend/src/routes/courses.ts`): Add `GET /api/courses/:id/regulatory-info` (using `sendNptelResponse` and validating `:id` against `/^noc\d{2}-[a-z]{2}\d{2}$/i`) that returns:
      - `ugcAbcCredits` (1, 2, or 3 credits), `minEngagementHours` (15, 30, or 45 hrs), and `aicteFdpEquivalency` ("Half-Week", "Full 1-Week", or "1.5-Week Extended AICTE FDP").
      - `examShiftAllocation`: Morning (55%) vs Afternoon (45%) candidate distribution and required TCS iON exam centers (250 seats/center) based on `course.enrollments`.
   2. Frontend (`frontend/src/components/CourseClassroom.tsx`): Add an accessible "NEP 2020 Credit Transfer & Exam Center Logistics" collapsible `<details>` card inside the Classroom sidebar that fetches and displays this regulatory metadata for the active course.
   3. Add an API test in `backend/test/api.test.ts` and run `npm test`.
   ```
3. **Step 3 (Verify in Browser)**:
   Open any course in `http://localhost:5173/`, click **"NEP 2020 Credit Transfer & Exam Center Logistics"**, and show the live UGC ABC credits, AICTE FDP equivalency, and TCS iON Morning/Afternoon center counts!

---

## Demo #8 (Complex Skill): Multi-Step Bhashini Translation & WebVTT Subtitle Pipeline (`nptel-bhashini-sync`)

### 8.1 Why This Matters Day-to-Day at IIT Madras
NPTEL translates thousands of hours of IIT/IISc video lectures into Indian regional languages under the **Bhashini National Language Translation Mission**. Day-to-day pain points include:
1. Finding which courses or weeks are missing regional language tracks (e.g., Telugu `te` or Tamil `ta`).
2. Ensuring machine translation does **not** mangle technical computer science/engineering terms (`O(n log n)`, `GCD`, `Gradient Descent`, `MOSFET`).
3. Generating compliant **WebVTT (`.vtt`)** closed-caption files that HTML5 `<video>` players and rural low-bandwidth learners can download for offline study.

### 8.2 Architecture Already Built in Your Repo
- **Skill Definition**: [`.agents/skills/nptel-bhashini-sync/SKILL.md`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/skills/nptel-bhashini-sync/SKILL.md)
- **CLI Coverage Auditor**: [`.agents/skills/nptel-bhashini-sync/scripts/audit-bhashini-coverage.mjs`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/skills/nptel-bhashini-sync/scripts/audit-bhashini-coverage.mjs)

### 8.3 End-to-End Live Execution Guide
1. **Step 1 (Run the Audit Script Live — 30 sec)**:
   ```bash
   node .agents/skills/nptel-bhashini-sync/scripts/audit-bhashini-coverage.mjs backend/src/data/courses.json
   ```
   Point out the console table: `en: 100%`, `ta: 100%`, `hi: 100%`, **`te: 0%`**.
2. **Step 2 (Copy-Paste Prompt to Trigger the Multi-Step `nptel-bhashini-sync` Skill)**:
   ```text
   Use the `nptel-bhashini-sync` skill to upgrade our regional language support for `noc26-cs01` ("Programming, Data Structures and Algorithms using Python"):
   1. Run the Bhashini coverage auditor to inspect current `te` (Telugu) coverage.
   2. Add accurate Telugu (`te`) Bhashini transcripts across all 4 weeks of `noc26-cs01` in `backend/src/data/courses.json`, preserving technical terms (`Python`, `GCD`, `O(log n)`, `Binary Search`, `Merge Sort`, `Dijkstra`) per the skill's glossary rules.
   3. Add the WebVTT closed-caption endpoint `GET /api/courses/:id/subtitles/:week/:lang` in `backend/src/routes/courses.ts` following the `nptel-bhashini-sync` specification.
   4. In `frontend/src/components/CourseClassroom.tsx` and `frontend/src/types/nptel.ts`, add `te` ("తెలుగు (Telugu)") to the Bhashini language switcher pills AND add a "Download .VTT Captions" button that downloads the `.vtt` subtitle file for the currently selected week and language.
   5. Re-run `audit-bhashini-coverage.mjs` and `npm test` to confirm `noc26-cs01` now shows `100%` Telugu coverage and all tests pass.
   ```
3. **Step 3 (Verify Live)**:
   - Show the terminal table where `noc26-cs01` jumped from `te: 0%` to **`te: 100%`**.
   - In `http://localhost:5173/`, open `noc26-cs01`, click the new **`తెలుగు (Telugu)`** pill in the classroom, and click **"Download .VTT Captions"**!

---

## Demo #9 (Complex Orchestration): Dynamic Specialist Subagent Creation (`define_subagent`) + Parallel Swarm for Batch Cohort Grading

### 9.1 Why This Matters Day-to-Day at IIT Madras
During semester-end grading (November & April), IIT Madras processes scores for hundreds of thousands of learners across 5,600+ SWAYAM Local Chapters. SPOC coordinators need a **Batch Cohort Simulator** that takes an entire college's student list, computes every student's Best-N assignment + proctored exam score, and flags **"At-Risk Dual-Threshold Trap"** students (students who have high assignment scores or high mock exam scores but fail one of the two 40% thresholds).

Instead of using a single generic agent, Antigravity lets engineers dynamically define a **domain-specialist subagent** in-session (`define_subagent`) and coordinate it alongside backend and frontend subagents (`invoke_subagent`).

### 9.2 End-to-End Live Execution Guide
1. **Copy-Paste Sample Prompt**:
   ```text
   We need to build a complex "SPOC Cohort Batch-Grading & At-Risk Learner Analyzer" feature.
   Please follow this exact multi-agent orchestration workflow:
   1. First, use `define_subagent` to create a specialist subagent named `nptel-psychometric-auditor` whose system prompt enforces the official IIT Madras 25/75 grading formula, Best-N assignment selection, and edge-case verification for batch cohorts.
   2. Invoke `nptel-psychometric-auditor` and `self` in parallel to implement:
      - Backend (`backend/src/routes/grading.ts` & `backend/src/services/gradingService.ts`): Add `POST /api/grading/batch-simulate` accepting `{ durationWeeks: 4 | 8 | 12, learners: Array<{ rollNumberMasked: string, name: string, assignmentScores: number[], examScorePercent: number }> }`. It must compute individual grades and return a cohort summary (`totalLearners`, `qualifiedCount`, `goldCount`, `silverCount`, `eliteCount`, `dualThresholdTrapCount`, and `results[]`).
      - Backend Tests (`backend/test/api.test.ts`): Add an integration test posting a 5-student college cohort (including a Gold medalist, a Dual-Threshold Trap student, and a borderline 40/100 student) to `POST /api/grading/batch-simulate`.
      - Frontend (`frontend/src/components/SpocDashboard.tsx`): Add a "Run Sample College Cohort Batch Simulation (5 Learners)" card at the bottom of the SPOC Dashboard that calls `POST /api/grading/batch-simulate` and renders the cohort pass breakdown and flags any "Dual-Threshold Trap" learners in an accessible table.
   3. Run `npm test` to verify all unit, API, and frontend build checks pass.
   ```

---

## Demo #10 (Complex Governance): Deterministic Lifecycle Hooks (`PreToolUse`, `PostToolUse`, `Stop` in `.agents/hooks.json`)

### 10.1 Why This Matters Day-to-Day at IIT Madras
When a 30-person engineering team adopts AI coding agents, Tech Leads ask: *"How do we guarantee an agent never deletes production seed files, never force-pushes to `main`, and never edits `courses.json` without running schema validation?"*

Prompts and rules guide the LLM, but **Lifecycle Hooks (`.agents/hooks.json`)** are **deterministic OS-level interceptors** that run *outside* the LLM before (`PreToolUse`) and after (`PostToolUse`) every tool call.

### 10.2 Architecture Already Built in Your Repo
- **Hook Config**: [`.agents/hooks.json`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/hooks.json)
- **`PreToolUse` Guard**: [`.agents/hooks/pre-command-guard.mjs`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/hooks/pre-command-guard.mjs) — inspects `toolCall.args.CommandLine` on `stdin` and outputs `{"decision": "deny", "reason": "..."}` if a command tries to `rm` `backend/src/data/(certificates|courses|spoc_analytics).json` or `git push --force`.
- **`PostToolUse` Validator**: [`.agents/hooks/post-edit-verify.mjs`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/hooks/post-edit-verify.mjs) — automatically runs `validate-course.mjs` after every `write_to_file` or `replace_file_content` call.

### 10.3 End-to-End Live Execution Guide
1. **Step 1 (Open [`.agents/hooks.json`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/hooks.json) and [`.agents/hooks/pre-command-guard.mjs`](file:///Users/pratham.lokhande/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal/.agents/hooks/pre-command-guard.mjs))**:
   Show how `PreToolUse` reads JSON from `stdin` and returns `decision: "deny"`.
2. **Step 2 (Demonstrate the Hook Blocking a Destructive Command via `stdin` Simulation or Live Prompt)**:
   Run this in the terminal to show the exact JSON payload Antigravity passes to `pre-command-guard.mjs` when a rogue command is attempted:
   ```bash
   echo '{"toolCall":{"name":"run_command","args":{"CommandLine":"rm -rf backend/src/data/certificates.json"}}}' | node .agents/hooks/pre-command-guard.mjs
   ```
   **Output**:
   ```json
   {"decision":"deny","reason":"NPTEL Production Safety Gate: Deleting core NPTEL seed datasets (certificates.json / courses.json / spoc_analytics.json) is prohibited."}
   ```
3. **Step 3 (Talk Track for IIT Madras Architects)**:
   > *"Even if a developer accidentally prompts the agent to wipe `certificates.json` or `git push --force`, `.agents/hooks.json` intercepts the tool call before the shell ever sees it and returns `decision: deny`."*

---

## Demo #11 (Complex Performance & Diagnostics): Core Web Vitals (`debug-optimize-lcp`) & Memory Leak Debugging (`memory-leak-debugging`)

### 11.1 Why This Matters Day-to-Day at IIT Madras
Twice a year—when semester enrollment opens and when proctored exam results are declared—`nptel.ac.in` sees traffic spikes from millions of students across Tier-2 and Tier-3 towns using budget Android phones on high-latency networks.
- **Slow Largest Contentful Paint (LCP)** on the homepage hero banner causes high bounce rates.
- **Detached DOM elements / event listener leaks** when students switch between 12 weeks of lectures and transcripts cause browser tabs to crash on 2GB RAM devices.

### 11.2 End-to-End Live Execution Guide
1. **Copy-Paste Sample Prompt (LCP & Rendering Optimization)**:
   ```text
   Use the `debug-optimize-lcp` and `modern-web-guidance` skills to audit and optimize the initial render and scrolling performance of our NPTEL homepage (`frontend/src/components/CourseCatalog.tsx` and `frontend/index.html`):
   1. Inspect `frontend/src/components/CourseCatalog.tsx` for Largest Contentful Paint (LCP) bottlenecks and off-screen rendering cost when rendering large course grids.
   2. Apply `content-visibility: auto` and `contain-intrinsic-size: 0 360px` to the course catalog card grid items so off-screen course cards skip layout/paint work on low-end rural devices.
   3. Verify in the live browser at `http://localhost:5173/` that the hero banner and catalog grid render with zero layout shift (CLS = 0) and zero console warnings.
   ```
2. **Copy-Paste Sample Prompt (React Classroom Memory & Cleanup Audit)**:
   ```text
   Use the `memory-leak-debugging` skill guidelines to audit `frontend/src/components/CourseClassroom.tsx` and `frontend/src/components/CourseCatalog.tsx` for potential React state retention, un-aborted `fetch()` calls (`AbortController`), or lingering timers when a learner rapidly switches between courses and weeks.
   Refactor data-fetching `useEffect` hooks to use `AbortController` cleanup on unmount/course-change so rapid navigation never triggers state updates on unmounted components or leaks closures.
   ```

---

## Demo #12 (Autonomous Operations): `/goal` Overnight Migrations, `/schedule` Recurring Monitors, & `workflow-skill-creator`

### 12.1 Three Day-to-Day Power Workflows to Show in Closing (4 mins)

#### A. `/schedule` — Automated Recurring Operations Check
Show how an IIT Madras DevOps or Backend engineer can schedule a recurring health and catalog integrity monitor right inside Antigravity:
```text
/schedule Every 30 minutes, run `node .agents/skills/nptel-course-ingestor/scripts/validate-course.mjs backend/src/data/courses.json` and check `http://localhost:4000/api/health`, then alert me only if schema validation fails or API latency exceeds 200ms.
```

#### B. `/goal` + `/boost` — Autonomous Multi-File Engineering
Explain how `/goal` pairs with the `Stop` hook so the team can hand off complex refactors:
```text
/goal Add OpenAPI 3.1 JSON schema endpoint (`GET /api/openapi.json`) documenting all 4 NPTEL routers (`/api/courses`, `/api/grading`, `/api/certificates`, `/api/spoc`), add integration tests in `backend/test/api.test.ts` validating the OpenAPI spec, and do not stop until `npm test` passes with 100% green assertions.
```

#### C. `workflow-skill-creator` — Turning Any Ad-Hoc Fix into a Team Skill
Whenever an IIT Madras senior engineer finishes solving a tricky task in chat (e.g., debugging a Bhashini encoding issue or migrating a database table), they simply type:
```text
Package what we just did into a reusable workspace skill in `.agents/skills/` using `workflow-skill-creator` so the rest of the IIT Madras team can run this workflow in one command.
```

---

# PART III: A DAY IN THE LIFE OF AN IIT MADRAS NPTEL ENGINEER WITH ANTIGRAVITY

Share this table with the IIT Madras engineering leadership to illustrate how Antigravity fits into every hour of their daily software lifecycle:

| Time of Day | Typical IIT Madras Engineering Task | Without Antigravity (Legacy Workflow) | With Antigravity (AI-First Workflow) | Antigravity Feature Used |
| :--- | :--- | :--- | :--- | :--- |
| **09:30 AM — Morning Triage** | Check overnight SPOC exam-fee sync logs & Bhashini translation queues | Manually run 4 bash scripts, grep logs, cross-check JSON files (35 mins) | Scheduled `/schedule` cron + `audit-bhashini-coverage.mjs` already summarized gaps in chat (2 mins) | `/schedule`, `nptel-bhashini-sync` Skill |
| **10:30 AM — New Feature Spec** | Product Manager sends a wireframe for a new Student Dashboard widget | Write frontend/backend tickets, debate edge cases in a 1-hour meeting | Drop wireframe image into chat + run `/plan` & `/grill-me` to resolve edge cases in 5 mins | Multimodal Input + `/plan` + `/grill-me` |
| **11:30 AM — Full-Stack Implementation** | Build API route + unit tests + GIGW 3.0 accessible React UI | 1–2 days of manual coding across `backend/` and `frontend/` | Spawn parallel subagents (`invoke_subagent`); `.agents/rules/` automatically enforces 25/75 formula & WCAG AA | `GEMINI.md`, `.agents/rules/`, Parallel Subagents |
| **02:30 PM — Course & Language Onboarding** | Onboard 15 new semester courses & verify regional transcripts | Copy-paste JSON, manually check `noc26-*` regex & Tamil/Hindi keys (3 hours) | Trigger `nptel-course-ingestor` & `nptel-bhashini-sync`; `PostToolUse` hook auto-validates every write (5 mins) | `.agents/skills/`, `hooks.json` (`PostToolUse`) |
| **04:00 PM — UI Bug & A11y QA** | Reproduce a filter or layout bug reported by a college SPOC | Open Chrome, manually click filters, inspect DOM & ARIA states (45 mins) | `/browser` reproduces bug visually, inspects `aria-pressed`, patches React state, and re-verifies (2 mins) | `/browser` + `a11y-debugging` + `debug-optimize-lcp` |
| **05:30 PM — Pre-PR Security & Merge** | Review PR for PII leaks, IDOR, and destructive shell commands | Manual code review by 1 overworked senior architect | `nptel-security-checklist` audits routes, `PreToolUse` hook blocks unsafe commands, `/learn` saves new rules | `nptel-security-checklist`, `PreToolUse` Hook, `/learn` |
