# Google Antigravity: Live Demo Playbook for the NPTEL Engineering Team (IIT Madras)

> Written independently from the code in this repo. It does not draw on the existing `docs/` playbooks.
> Prepared 15 Oct 2026, against **Antigravity app v2.23.1** (13 Oct 2026) and **Antigravity CLI v1.3.5**. The CLI on the presenter laptop reports **v1.2.11**, so run `agy update` first (see §3).
> Legend: ✅ = confirmed in the official docs, the changelog, or `agy --help` while writing this. 🟡 = **(verify before session)**.

---

## 1. Session overview

**Goal:** Help the NPTEL developers turn their Gemini Enterprise (GE) Antigravity quota into time saved on their real backlog. Every demo runs on an NPTEL-shaped codebase (catalog, Best-N grading, e-certificates, SPOC dashboard, Bhashini transcripts) and fixes a real gap in it.

**Audience:** N developers who build and maintain nptel.ac.in. They are experienced, use Claude Code daily, and have no patience for toy demos.

**Format:** 90 minutes, live, with screen share. About 67 minutes of demos, 15 minutes of Q&A and about 8 minutes of buffer.

**Narrative arc:** quick wins → planning and review → browser verification → parallel agents → customization they can adopt tomorrow → Automations and Remote Control.

| # | Segment | Min | Surface | Features covered (star features in **bold**) |
|---|---|---|---|---|
| 0 | Opening: why this, quota framing, surface map | 4 | app | Surfaces, GE sign-in, model picker |
| 1 | S1 Coordinator-pill bug hides the flagship course | 5 | app | **Artifacts (task list, walkthrough)**, **Review Changes + Git commit**, permission picker, `/btw` |
| 2 | S2 Headless API contract audit → JSON | 3 | CLI | **`agy -p` + `--json-schema`**, `/codesearch`, `/context` |
| 3 | S3 Harden the grading API, with rewind | 5 | CLI | **`/diff`**, **`/rewind`**, `/effort`, Auto mode, terminal sandbox |
| 4 | S4 Exam registration and hall ticket: grill → plan → steer | 7 | app | **`/grill-me`**, **`/plan` + Plan Review Policy**, **inline plan comments**, folder attachment, voice |
| 5 | S5 Dropped-week indicator with Tab (optional) | 3 | IDE extension | **Tab completion**, agent side panel, inline diff |
| 6 | S6 Mobile + accessibility verification with the browser agent | 7 | app | **Browser subagent**, **recordings**, **screenshot region comments**, Chrome profile, allowlist |
| 7 | S7 Three agents in parallel: transcript search, API docs, tests | 7 | app + CLI | **Parallel conversations**, **worktrees**, **dynamic subagents**, message a subagent, `/goal`, `/agents`, background tasks |
| 8 | S8 Performance deep pass (pre-run) | 2 | app | **`/boost`** (pre-run), `/teamwork-preview` (talk-through) |
| 9 | S9 SPOC analytics as a live chart | 4 | app | **Generative UI (Chart.js)** |
| 10 | S10 Team conventions as code: rules, skills, subagent, hooks | 7 | app + CLI | **AGENTS.md**, **Skills as slash commands**, **custom subagent**, **JSON hooks (deny + verify)**, `/permissions` |
| 11 | S11 Domain tools via MCP and plugins | 5 | app + CLI | **MCP (`mcp_config.json`, `agy mcp add`)**, **Marketplace / Build with Google (Chrome DevTools)**, `agy plugin import` |
| 12 | S12 Nightly guard plus control from a phone | 6 | app + phone | **Automations (Run Now)**, **Remote Control + push**, `/resume`, `/usage` |
| – | Wrap-up and take-home kit pointer | 2 | – | – |
| – | **Q&A** | 15 | – | – |
| | **Total** | **82** (+8 buffer) | | |

---

## 2. Codebase snapshot

### Stack
| Layer | Tech |
|---|---|
| Backend | Node 20, **Express 4**, TypeScript 5 (ESM, `"module": "NodeNext"`, so imports end in `.js`), run with `tsx` |
| Frontend | **React 18** + Vite 5 + TypeScript + Tailwind 3, `lucide-react` icons. No router: tabs are held in `App.tsx` state |
| Data | **No database.** JSON files are read with `fs.readFileSync` **on every request**: `backend/src/data/courses.json` (6 courses), `certificates.json` (3), `spocStats.json` (5 chapters) |
| Auth | **None.** The header "Log in" button only toggles a toast (`frontend/src/components/Header.tsx:409`) |
| Tests | Node's built-in `node:test` + `assert/strict` via `tsx`. 2 files, **10 tests, all passing** (checked 15 Oct) |
| CI | `.github/workflows/ci.yml`: catalog validator → backend tests → frontend `tsc -b && vite build` |
| Existing agent config | `GEMINI.md`, `.agents/rules/` (2), `.agents/skills/` (3), `.agents/hooks.json` (2 hooks), `.agents/plugins/nptel-enterprise-kit/`, and a stdio MCP server at `scripts/mcp/nptel-swayam-mcp-server.mjs` |

### Run it locally
```bash
cd nptel-dummy-portal
npm install && npm --prefix backend install && npm --prefix frontend install
npm run dev          # backend http://localhost:4000 + frontend http://localhost:5173
npm test             # backend tests + catalog validator
npm --prefix frontend run build   # type-check + production build
```

### Directory structure
```
nptel-dummy-portal/
├── backend/
│   ├── src/server.ts                 # Express app, mounts 4 routers, exports `app` for tests
│   ├── src/routes/{courses,grading,certificates,spoc}.ts
│   ├── src/services/gradingService.ts  # Best-N, 25/75 split, tiers, medal simulator
│   ├── src/utils/apiResponse.ts      # sendNptelSuccess / sendNptelError envelope
│   ├── src/data/*.json               # seed data
│   └── test/{api,grading}.test.ts
├── frontend/src/
│   ├── App.tsx                       # bootstraps 3 fetches, tab switching, footer
│   ├── components/{Header,CourseCatalog,CourseClassroom,CertificateVerifier,SpocDashboard,ProgressRing}.tsx
│   └── types/nptel.ts                # hand-copied mirror of backend types
├── scripts/demo-reset.sh, scripts/mcp/nptel-swayam-mcp-server.mjs
├── .agents/  GEMINI.md  .github/  docs/  demo-assets/
```

### Domain entities
- **Course** (`noc26-cs01` … `noc26-hs06`). The ID must match `/^noc\d{2}-[a-z]{2}\d{2}$/i`. Fields include `durationWeeks` (4, 8 or 12), `credits`, `aicteFdpApproved`, `examRegistrationOpen`, `examDate` (an IST string), `weeks[]`.
- **CourseWeek**: `videoTitle`, `assignmentTitle`, `transcripts: { en, ta, hi }`. Only 1–4 weeks are seeded per course, even for 8- and 12-week courses.
- **Grading** (`gradingService.ts`): Best 3/4, 6/8 or 8/12 assignments → out of 25. Exam → out of 75. The learner must reach both **≥10/25** and **≥30/75**. Tiers: Successfully Completed (40), Elite (60), Elite + Silver (75), Elite + Gold (90). The total is computed with `Math.round`.
- **Certificate**: `NPTEL26CS01S1049201`, which must match `/^NPTEL\d{2}[A-Z]{2}\d{2}S\d{7}$/i`. Each record holds the student name, college, scores and tier.
- **SPOC Local Chapter**: `LC-TN-0014` and similar, with enrolment, exam-registration and medal counts per state.

### Routes, APIs and pages
| Method & path | File | Notes |
|---|---|---|
| `GET /api/health` | `server.ts:17` | |
| `GET /api/courses?search&discipline&durationWeeks&institute&aicteFdpApproved` | `routes/courses.ts:22` | Server-side filtering exists, but **the frontend never uses it** |
| `GET /api/courses/:id` | `routes/courses.ts:74` | 400 on a bad format, 404 if missing |
| `POST /api/grading/calculate` | `routes/grading.ts:16` | Validated |
| `POST /api/grading/simulate-medals` | `routes/grading.ts:77` | **Weaker validation** (see gaps) |
| `GET /api/certificates` | `routes/certificates.ts:21` | **Returns every certificate, including student names** |
| `GET /api/certificates/:certId/verify` | `routes/certificates.ts:30` | |
| `GET /api/spoc/analytics?state` | `routes/spoc.ts:15` | |

The **pages** are tabs selected in `App.tsx` (no URLs):
- `catalog`: hero, coordinator-institute pills, news, filters, cards
- `classroom`: weekly modules, a video placeholder, EN/TA/HI transcript, a Best-N grade calculator, the medal simulator
- `certificates`: the verifier
- `spoc`: KPI cards and a leaderboard table

### Tests
- `backend/test/grading.test.ts` has 4 unit tests (Best-N, Gold, the assignment-threshold failure, the simulator).
- `backend/test/api.test.ts` has 6 HTTP tests. It includes an in-process fallback for when a sandbox blocks loopback (`EPERM`).
- **There are no frontend tests, no E2E tests and no coverage reporting.** There are no tests for tier boundaries, rounding, more scores than weeks, or `simulate-medals` validation.

### Gaps: the raw material for the demos (all verified in code)
| # | Gap | Where | Used in |
|---|---|---|---|
| G1 | **The "IIT Madras" coordinator pill hides the flagship course.** The pill sets `selectedInstitute = 'IIT Madras'` and the filter uses strict `===`, but `noc26-cs01` has `institute: "IIT Madras / CMI"`. The page shows 4 courses instead of 5. The backend uses `includes()`, so frontend and backend disagree. | `CourseCatalog.tsx:164-165, 493` vs `routes/courses.ts:54-58` | S1 |
| G2 | **`simulate-medals` does no per-score validation.** `["abc", 500]` returns 200 because the scores are silently coerced and clamped, while `/calculate` returns 400. | `routes/grading.ts:90-103` | S2, S3 |
| G3 | **Assignment count is not checked against duration.** Eight scores of 100 for a 4-week course are accepted. | `routes/grading.ts:29-43` | S2, S3 |
| G4 | **PII and enumeration exposure.** `GET /api/certificates` lists every learner's name, roll number and college. Verify has no rate limit. | `routes/certificates.ts:21` | S2, S10 |
| G5 | **Dead code for the dropped-week indicator:** `isDropped = … && false;`, so dropped Best-N weeks are never highlighted. | `CourseClassroom.tsx` (~line 383, grading tab) | S5 |
| G6 | **No mobile navigation.** The official menus (Initiatives / Courses / Inspired Learners / Exams / More) are `hidden md:flex` with no hamburger, so they disappear below 768 px. | `Header.tsx:106-108` | S6 |
| G7 | **Tamil and Hindi transcript blocks have no `lang` attribute** (WCAG 3.1.2), so screen readers read Tamil with English rules. | `CourseClassroom.tsx` transcript card (~line 343) | S6 |
| G8 | **Six hard-coded `http://localhost:4000` URLs** bypass the Vite `/api` proxy. Deployment would break, and the code relies on wide-open `cors()`. | `App.tsx:21-23`, `CourseClassroom.tsx:71,80`, `CertificateVerifier.tsx:26` | S1 (`/btw`), S8 |
| G9 | **The slider fires 2 POSTs per tick.** There is no debounce. The grading and simulator calls run on every `onChange`. | `CourseClassroom.tsx:66-102` | S8 |
| G10 | **JSON is re-read from disk on every request.** There is no cache and no pagination. | all `routes/*.ts` | S8 |
| G11 | **No exam registration or hall ticket**, even though `examRegistrationOpen` and `examDate` exist (`noc26-hs06` is closed). | data + types | S4 |
| G12 | **No transcript search.** The transcripts are rich but only viewable one week at a time. | `CourseClassroom.tsx` | S7 |
| G13 | **No API docs (OpenAPI) and no shared types.** `frontend/src/types/nptel.ts` duplicates `gradingService.ts` by hand. | – | S7 |
| G14 | **Malformed JSON bodies get Express's default error response**, not the `{ success, nptelMeta, error }` envelope. No error middleware exists. | `server.ts` | S2 |
| G15 | **Only `en`, `ta` and `hi` exist**, but the SPOC states include Maharashtra, Karnataka and Telangana (mr, kn, te). | `types/nptel.ts:1` | S11 (MCP Bhashini tool) |

---

## 3. Pre-session setup checklist (T-1 day and T-30 min)

### Install and update
- [ ] **Antigravity app** at **v2.23.1** or later. The v2.23.0 release added the permission picker in the message box and `.zip`/folder attachments.
- [ ] **CLI:** `agy update`, then `agy --version` should show ≥ **1.3.5**. Your machine currently has 1.2.11. Auto mode (`--mode auto` / Shift+Tab) and `/compact` need 1.3.5.
- [ ] **IDE caveat ✅:** the docs state *"Antigravity IDE is not supported for enterprise customers."* Pick one option for S5:
  - (a) run S5 in the **JetBrains** (WebStorm) extension, which offers GE sign-in in **Preview**, or
  - (b) run it in the Antigravity IDE with a personal Google account and **say so on screen**, or
  - (c) cut S5.
  - Also note that the docs say Gemini 4 Argon is not available in the Antigravity IDE.
- [ ] Chrome is installed. In the app's browser settings, enable a **separate Chrome profile** for the browser agent so your personal tabs and cookies don't appear on screen.

### Sign-in, models and permissions
- [ ] Sign in to the app and CLI with the **Gemini Enterprise** account. Choose the correct license when prompted, then check Settings → account.
- [ ] Open the model picker and **write down exactly which models the IIT Madras tenant exposes.**
  - The docs list Gemini 4 Argon, Gemini 3.8, 3.7 and 3.6 Flash, and Gemini 3.1 Pro for Enterprise.
  - Claude Opus/Sonnet 5.5 appear only if an admin opts in through the Cloud Console, and they are billed per token.
- [ ] Default model for the demos: **Gemini 3.8 Flash** for S1–S3, S9 and S12, and the strongest Gemini available (Argon or 3.1 Pro) for S4, S7 and S8. Use `/effort` to adjust.
- [ ] Permission preset: **Default** (sandboxed terminal, asks before network or MCP access). Switch it live in S1 using the picker in the message box.
- [ ] Settings → Remote Control → **Enable** (S12). Pair your phone now, install the web app to the home screen, and allow notifications.

### Antigravity Project
- [ ] Create a Project called **"NPTEL Portal"** with **two folders**: `nptel-dummy-portal/backend` and `nptel-dummy-portal/frontend`.
  - Add the repo root as a third folder so the agent picks up `.agents/`, `AGENTS.md`/`GEMINI.md` and `scripts/`. 🟡 Test once that rules load when root and subfolders are separate entries. If they don't, use the single root folder.
- [ ] Project settings → **Plan Review Policy = review every plan** (S4).
- [ ] Turn on worktree support for the Project (S7).

### App, data and git
```bash
cd ~/workspace/project-ongoing/IIT-Madras/nptel-dummy-portal
git status                                  # must be clean
npm install && npm --prefix backend install && npm --prefix frontend install
npm test                                    # expect: 10 pass + "6 courses compliant"
git tag demo-baseline                       # the single source of truth for resets
for s in s1-pill-filter s3-grading-hardening s4-exam-registration s5-dropped-week \
         s6-mobile-a11y s7a-transcript-search s7b-openapi s7c-tests s10-team-kit s12-automation; do
  git branch demo/$s demo-baseline
done
```
- [ ] **Pre-run S4, S6, S7 and S8 once at T-1 day** on their branches and commit the results as `demo/<scenario>-done`, for example `git switch demo/s4-exam-registration && … && git switch -c demo/s4-exam-registration-done`. These are your fallbacks.
- [ ] Keep the **S8 `/boost` conversation from the pre-run** open and pinned. Its result is what you show.
- [ ] `npm run dev` should be running in the app's embedded terminal (Ctrl/Cmd + `), with the backend on :4000 and the frontend on :5173.

### MCP servers and plugins to pre-install
- [ ] **Do not pre-register** the repo MCP server `scripts/mcp/nptel-swayam-mcp-server.mjs`. Registering it is part of S11. Do test `node scripts/mcp/nptel-swayam-mcp-server.mjs` once by hand.
- [ ] Customizations tab → Build with Google: **pre-install "Chrome DevTools"** (S11) and **"Modern web guidance"** (it helps S6).
- [ ] Ask the GE admin to confirm that **MCP and browser admin policies** allow local stdio MCP servers and `localhost` browsing.

### On screen at start
1. The Antigravity app with the "NPTEL Portal" Project open and the Agent Manager visible.
2. Chrome on `http://localhost:5173` (catalog tab).
3. Terminal (iTerm) at the repo root, CLI ≥1.3.5, font size raised for projection.
4. Phone mirrored (QuickTime or scrcpy) for S12.
5. This playbook on a second monitor, **not** shared.

---

## 4. Feature coverage matrix

| Inventory feature | Covered in | Status / note |
|---|---|---|
| **Surfaces** | | |
| Antigravity 2.x desktop app (agent-first) | S1, S4, S6–S12 | ✅ |
| Antigravity IDE (Tab + agent side panel) | S5 (optional) | ✅ exists. ⚠️ **Not supported for Enterprise accounts** per docs |
| IDE extensions (VS Code, JetBrains, Visual Studio, Zed, Xcode) | S5 (JetBrains) | ✅. GE sign-in is listed as Preview for JetBrains, Zed and Xcode. VS Code and Visual Studio GE support 🟡 |
| CLI `agy`, headless `-p`, JSON-schema output | S2, S3, S7, S10, S11 | ✅ `agy --help`: `-p`, `--output-format json`, `--json-schema` |
| Antigravity SDK | Talk-through only (wrap-up) | ✅ exists (Python SDK docs). Not live because it is a build-your-own-agent topic. Point to the Build with Google "Antigravity SDK" plugin |
| Remote Control (browser/phone, push) | S12 | ✅ App setting, `agy --remote-control`, `agy remote-control start` |
| **Core agent and artifacts** | | |
| Implementation plans | S4 | ✅ |
| Task lists | S1, S4 | ✅ |
| Walkthroughs | S1, S6 | ✅ |
| Screenshots | S6 | ✅ |
| Browser recordings | S6 | ✅ (Save Video since v2.17) |
| Inline comments on artifacts | S4 | ✅ |
| Inline comments on diffs | S1 | ✅ |
| Inline comments on image regions | S6 | ✅ (v2.10 region selection) |
| Review Changes pane + Git stage/commit | S1 | ✅ |
| Embedded terminal | S1, S7 | ✅ (Ctrl/Cmd + `). Enterprise accounts have had it since v2.14 |
| Rewind / undo to checkpoints | S3 (CLI `/rewind`), S6 (app undo) | ✅ |
| Generative UI (Chart.js / Plotly) | S9 | ✅ v2.11 |
| Attachments (images, PDF, Office, audio, .zip, folders) | S4 (folder), S6 (screenshot) | ✅. PDF, Office, audio and zip are talk-through only because they add no time saving here |
| Voice dictation | S4 (`/voice` or mic button) | ✅ CLI `/voice`. App voice transcription ✅ |
| **Slash commands** | | |
| `/plan` + Plan Review Policy | S4 | ✅ |
| `/goal` | S7 lane B (CLI) | ✅ in the CLI changelog. App availability 🟡 |
| `/grill-me` | S4 | ✅ appears in the docs comparison table. Exact behaviour 🟡 |
| `/browser` | S6 | 🟡 Not in the docs slash index. If it is missing, say "use the browser" in the prompt |
| `/schedule` | S12 (CLI aside) | 🟡 The `schedule` tool is confirmed in the CLI changelog. Command syntax unverified |
| `/btw` | S1 | ✅ |
| `/boost` | S8 (pre-run) | ✅ paid plans. Costs more quota |
| `/effort` | S3 | ✅ |
| `/codesearch` | S2 | ✅ |
| `/context` | S2 | ✅ |
| `/diff` | S3 | ✅ |
| `/permissions` | S10 | ✅ |
| `/resume` | S12 | ✅ |
| `/agents` | S7 | ✅ |
| `/teamwork-preview` | S8 (talk-through) | ✅ in the docs (paid plans). Too long to run live |
| `/voice` | S4 | ✅ |
| `/usage`, `/credits` | S12 / §7 | ✅. Enterprise may not show per-model quotas 🟡 |
| **Multi-agent** | | |
| Parallel conversations in a Project | S7 | ✅ |
| Dynamic subagents | S7 lane A | ✅ |
| Message a subagent directly | S7 | ✅ v2.19.1 |
| Git worktrees | S7 | ✅ (subagent workspace `branch` = isolated worktree) |
| Async background tasks | S7 (dev server), S4 (execution continues while you present) | ✅ |
| Multi-folder Projects with their own settings | Setup, S1 | ✅ |
| **Browser** | | |
| Browser subagent (drive Chrome, screenshots, video) | S6 | ✅. Uses extra quota |
| Allowlist / denylist | S6 (show the `localhost` default) | ✅ for the IDE. For the app 🟡 |
| Separate Chrome profile | Setup, S6 | ✅ |
| **Customization** | | |
| Rules: AGENTS.md / GEMINI.md, global and project, `@path` | S10 + kit | ✅ (`.agents/rules/*.md` need `trigger:` frontmatter, 20k-token rules budget) |
| Agent Skills (workflows → skills, invoked as slash commands) | S10 + kit | ✅ |
| Custom subagents (Markdown + frontmatter) | S10 + kit | ✅ for `name/description/tools/model/skills`. `rules:`, `hooks:` and `inheritCustomizations` appear in the changelog (v2.11, v2.17, v2.9.1) but not on the subagents doc page 🟡 |
| JSON lifecycle hooks | S10 + kit | ✅ events and decisions documented |
| MCP servers (`mcp_config.json`) | S11 | ✅ `.agents/mcp_config.json`, `~/.gemini/config/mcp_config.json`, `agy mcp add` |
| Plugins / Marketplace / Customizations tab | S11 | ✅ |
| Build with Google plugins | S11 (Chrome DevTools live). Others talk-through | ✅ The docs list Modern web guidance, Firebase, Antigravity SDK, Android CLI, Science, Chrome DevTools, Dart & Flutter, Data Agent Kit, Google Maps Platform and Google Cloud. "Gemini API" is **not** in the current list 🟡 |
| Sidecars and UI extensions | Talk-through only (S11) | ✅ Sidecars (`sidecar.json` under `~/.gemini/config/sidecars/`) and UI extensions in the side pane (v2.22) exist. Not live because neither has an NPTEL use case worth 5 minutes |
| **Automation** | | |
| Automations (cron or one-off, Run Now, Create with Prompt) | S12 | ✅ Renamed from Scheduled Tasks, Run Now (v2.21.1). "Create with Prompt" label 🟡 |
| **Safety and enterprise** | | |
| Permission presets (picker in the message box) | S1, S10 | ✅ Default / Request Review / Turbo |
| Terminal sandbox (file + network) | S3, S10 | ✅ |
| Sensitive-path protection | S10 (talk-through + custom hook) | ✅ (`.git/`, `~/.ssh`, destructive commands) |
| GE sign-in + admin policies (model, MCP, browser) | Opening, Q&A | ✅ v2.5.0 |
| Regional inference | Q&A | ✅ Global / US / EU. No in-country (India) region is listed 🟡 |
| Model choice for the GE tenant | Setup, Opening | 🟡 Check in the tenant |
| **Found during verification (not in your list)** | | |
| CLI **Auto mode** (`--mode auto`, Shift+Tab) | S3 | ✅ CLI 1.3.5 |
| CLI `/compact` | §7 Quota tips | ✅ CLI 1.3.5 |
| `agy plugin import` ("from gemini or claude") | S11 | ✅ in `agy plugin --help`. What exactly it imports from Claude Code 🟡 |

**Not covered live:** Antigravity SDK, sidecars, UI extensions, PDF/Office/audio/zip attachments, `/teamwork-preview` execution, regional inference. Each is talk-through only, for the reasons given above.

---

## 5. Demo scenarios

> **Global reset:** `git switch -f demo/<scenario> && git reset --hard demo-baseline && git clean -fd -- backend frontend`. Only use this on a `demo/*` branch, and look at `git status` before cleaning.
> Each scenario starts from its own `demo/*` branch cut from `demo-baseline`, so a failure in one never blocks the next.

---

### Scenario 1: The "IIT Madras" pill hides the flagship course

- **Antigravity features showcased:** Artifacts (task list → walkthrough), Review Changes pane with inline diff comment and Git commit, the permission preset picker in the message box, `/btw`
- **Surface:** app
- **Why NPTEL devs care:** A filter that silently drops the most-enrolled course (84k learners) is exactly the kind of production bug that becomes a ticket. Here it goes from report to reviewed commit without leaving the app.
- **Starting state:** `git switch demo/s1-pill-filter`. Dev server running. In Chrome, click the **IIT Madras** pill in "Partner IITs and IISc" and point out that it says **"Showing 4 of 6"** and that *Programming, Data Structures and Algorithms using Python* is missing.
- **Prompt(s) to paste:**

  First set the preset picker in the message box to **Request Review**, so the audience sees the approval gates. Then paste:
  ```text
  Bug: on the catalog tab, clicking the "IIT Madras" coordinator pill shows 4 of 6 courses and hides noc26-cs01
  ("Programming, Data Structures and Algorithms using Python"), whose institute is "IIT Madras / CMI".

  Root cause is in frontend/src/components/CourseCatalog.tsx: matchesInstitute uses strict equality against
  COORDINATOR_INSTITUTES[].name, while backend/src/routes/courses.ts filters institute with a case-insensitive includes().

  Fix it so the frontend matches the backend semantics:
  - A course matches a coordinator pill if its institute, split on "/", contains that coordinator name (case-insensitive, trimmed).
    "IIT Madras / CMI" must match "IIT Madras"; "IIT Kharagpur" must not match "IIT Madras".
  - Extract the predicate into a small exported pure function (e.g. matchesCoordinatorInstitute) in the same file so it is testable.
  - Do not touch the hero, news, testimonials sections or any styling.
  Acceptance: clicking "IIT Madras" shows 5 of 6; "IIT Kharagpur" shows 1 (noc26-cs05); "IIT Bombay" shows the existing empty state.
  Verify with `npm --prefix frontend run build`. Produce a task list first and a short walkthrough at the end.
  ```
  While it works, show the side question:
  ```text
  /btw why do App.tsx, CourseClassroom.tsx and CertificateVerifier.tsx call http://localhost:4000 directly when frontend/vite.config.ts already proxies /api? One paragraph, no edits.
  ```
  Diff comment to leave in Review Changes, on the new helper:
  ```text
  Also handle a trailing "(IIT Madras)" style suffix? No — keep it to the "/" split only, but add a one-line JSDoc stating the rule.
  ```
- **What to point at on screen:**
  - The **task list artifact** filling in.
  - The approval prompt for `npm … build`, which appears because of Request Review. Approve it, then flip the picker back to **Default** for the rest of the session.
  - The `/btw` answer arriving in a side panel **without derailing** the main thread.
  - In **Review Changes**, the diff, your inline comment, the agent's follow-up edit, then **Stage → Commit** from the pane.
- **Expected output / artifacts:** An edit to `CourseCatalog.tsx` adding the new exported predicate and using it in `matchesInstitute`, plus a walkthrough artifact. **Verify:** the build passes, the IIT Madras pill shows **5 of 6**, and the commit appears in `git log -1`.
- **Talking point:** "This is a typical prod bug: frontend and backend disagree on what 'institute' means. Notice that I never left the app. Plan, diff, a review comment, the commit. The side question about hard-coded URLs didn't pollute the main context."
- **Claude Code comparison:** In Claude Code you'd do the same fix in the terminal and review the diff in git or your IDE. Antigravity adds a dedicated Review Changes pane where you can comment inline on the diff and stage and commit right there.
- **Est. time:** 5 min · **Risk:** Low · **Fallback:** Talk through the root cause using the exact lines (`CourseCatalog.tsx:164-165`) and show `git diff demo-baseline demo/s1-pill-filter-done` if you pre-ran it · **Reset:** `git switch -f demo/s1-pill-filter && git reset --hard demo-baseline`

---

### Scenario 2: API contract audit as structured JSON (headless CLI)

- **Antigravity features showcased:** `agy -p` headless mode, `--output-format json` and `--json-schema`, then interactive `/codesearch` and `/context`
- **Surface:** CLI
- **Why NPTEL devs care:** This is a read-only audit that returns machine-readable findings, so it can run in CI. Before exam season they could gate every PR on "no unvalidated grading input".
- **Starting state:** `demo-baseline`, repo root, CLI ≥1.3.5. No edits are made.
- **Prompt(s) to paste:**
  ```bash
  agy -p "Audit every Express route mounted in backend/src/server.ts (files in backend/src/routes/). For each route report: method, path, whether every request input (params, query, body array elements) is validated before use, whether errors use sendNptelError from backend/src/utils/apiResponse.ts, and any PII it returns. Specifically check POST /api/grading/simulate-medals element validation, whether assignmentScores.length is checked against durationWeeks, GET /api/certificates PII exposure, and what happens on a malformed JSON body. Read-only: do not modify files." \
    --output-format json \
    --json-schema '{"type":"object","required":["routes"],"properties":{"routes":{"type":"array","items":{"type":"object","required":["method","path","inputsValidated","usesEnvelopeOnError","severity","finding"],"properties":{"method":{"type":"string"},"path":{"type":"string"},"inputsValidated":{"type":"boolean"},"usesEnvelopeOnError":{"type":"boolean"},"returnsPII":{"type":"boolean"},"severity":{"type":"string","enum":["none","low","medium","high"]},"finding":{"type":"string"}}}}}}' \
    | jq '.response | fromjson? // . | .routes[] | select(.severity != "none") | {method, path, severity, finding}'
  ```
  > 🟡 Check the envelope once at T-1. The docs show `{"conversation_id","status","response","usage"}`. If `response` is already an object, the `fromjson? // .` fallback handles it.

  Then go interactive to show that you can dig in:
  ```bash
  agy
  ```
  ```text
  /codesearch NPTEL_ERR_INVALID_ASSIGNMENTS
  ```
  ```text
  /context
  ```
- **What to point at on screen:** The clean JSON arriving in `jq` (no prose to parse). The `/codesearch` hits in `routes/grading.ts` (two error sites with different validation strength). `/context`, to show how little context a read-only audit uses.
- **Expected output / artifacts:** Expect findings flagged medium or high for `simulate-medals` (G2), `calculate` (G3), `GET /api/certificates` (G4, PII) and the malformed-JSON envelope (G14). **Verify:** at least those four appear. Spot-check one with `curl -s -XPOST localhost:4000/api/grading/simulate-medals -H 'content-type: application/json' -d '{"durationWeeks":8,"assignmentScores":["abc",500]}' | jq .success`, which prints `true`.
- **Talking point:** "Same agent, no UI. That `--json-schema` flag is the difference between 'the AI said something' and a CI step that fails the build. The quota cost of a read-only audit like this is small."
- **Claude Code comparison:** This maps to `claude -p --output-format json` in CI. Antigravity's `--json-schema` makes the CLI enforce the shape instead of you validating it afterwards. 🟡 Check whether the team's Claude Code version has an equivalent flag before claiming a difference.
- **Est. time:** 3 min · **Risk:** Low–Med (output envelope shape) · **Fallback:** Drop `| jq …` and show the raw JSON · **Reset:** none (read-only)

---

### Scenario 3: Harden the grading API, and rewind a bad turn

- **Antigravity features showcased:** `/effort`, Auto mode (Shift+Tab), the terminal sandbox badge, `/diff`, `/rewind`
- **Surface:** CLI
- **Why NPTEL devs care:** Grading endpoints decide who gets a certificate. Validation gaps here end up as RTI complaints. The fix is small but needs tests, and you need a safe undo.
- **Starting state:** `git switch demo/s3-grading-hardening`, then `agy` at the repo root.
- **Prompt(s) to paste:**
  ```text
  /effort low
  ```
  Press **Shift+Tab** until the mode reads **Auto**, then paste:
  ```text
  Harden backend/src/routes/grading.ts:
  1. POST /api/grading/simulate-medals must apply exactly the same assignmentScores validation as /calculate
     (finite numbers, 0..100, non-empty) and return 400 NPTEL_ERR_INVALID_ASSIGNMENTS otherwise.
     Extract one shared validator in that file instead of duplicating the predicate.
  2. Both endpoints must reject assignmentScores.length > durationWeeks with 400 NPTEL_ERR_TOO_MANY_ASSIGNMENTS
     (message must name the duration, e.g. "a 4-week course has at most 4 weekly assignments").
     Fewer submissions than weeks stays valid (missing weeks count as 0 — see calculateNptelGrade padding).
  3. Add tests to backend/test/api.test.ts using the existing apiFetch helper: simulate-medals with ["abc", 500] -> 400,
     calculate with 8 scores for durationWeeks 4 -> 400, simulate-medals happy path still 200.
  Do not change gradingService.ts. Run `npm --prefix backend test` and show me the summary.
  ```
  Then simulate a bad turn:
  ```text
  Now also rename every NPTEL_ERR_* code in the backend to lowercase snake_case.
  ```
  Let it run for about 15 seconds, then:
  ```text
  /rewind
  ```
  Pick the message before the rename, then:
  ```text
  /diff
  ```
- **What to point at on screen:**
  - The **sandbox badge** on `npm test`. It runs without prompting because it stays in the workspace.
  - Auto mode approving file edits without asking.
  - `/rewind` restoring the pre-rename state.
  - The syntax-highlighted, folded `/diff`. Press `f` to toggle the whole file.
- **Expected output / artifacts:** Changes to `grading.ts` and `api.test.ts`. **Verify:** `npm --prefix backend test` shows **≥13 tests, 0 failures**, and after the rewind `grep -c NPTEL_ERR_ backend/src/routes/grading.ts` still returns uppercase codes.
- **Talking point:** "Low effort for a small, well-specified change saves quota. Auto mode handles edits and sandboxed commands. Anything that leaves the sandbox still gets a second agent's review first. And when I give a bad instruction, `/rewind` undoes the files as well as the chat."
- **Claude Code comparison:** Claude Code has plan, accept-edits and auto-style modes, `/rewind` checkpoints and effort control too, so this flow will feel familiar. Antigravity's differences are the default OS-level terminal sandbox and the separate reviewer agent for commands that escape it.
- **Est. time:** 5 min · **Risk:** Low · **Fallback:** If Auto mode is missing (old CLI), use `--mode accept-edits`. If `/rewind` misbehaves, run `git restore -- backend` · **Reset:** `git switch -f demo/s3-grading-hardening && git reset --hard demo-baseline`

---

### Scenario 4: Exam registration and hall ticket. Grill, plan, steer, then let it build

- **Antigravity features showcased:** `/grill-me`, `/plan` with Plan Review Policy, **inline comments on the implementation-plan artifact**, folder attachment, voice dictation, background execution
- **Surface:** app
- **Why NPTEL devs care:** Exam registration and hall tickets are the highest-stakes flow each semester. A plan you can mark up like a design doc, before any code exists, is how a senior dev wants to use an agent here.
- **Starting state:** `git switch demo/s4-exam-registration`. In the app, start a new conversation in the NPTEL Portal Project and **attach the folder** `backend/src/data` (drag it into the message box).
- **Prompt(s) to paste:**
  ```text
  /grill-me
  We need learner exam registration and a printable hall ticket for NPTEL proctored exams in this repo.
  Context: courses in backend/src/data/courses.json already have examRegistrationOpen and examDate (IST strings);
  noc26-hs06 has registration closed. There is no auth and no database. API conventions are in
  backend/src/utils/apiResponse.ts (sendNptelSuccess / sendNptelError, NPTEL_ERR_* codes).
  Interview me before planning: ask at most 5 questions, the ones that change the design.
  ```
  Have these answers ready (type them, or **dictate them with the mic / `/voice`**):
  ```text
  1) Identity: no auth yet; take learnerName + email in the form, no Aadhaar, no phone.
  2) Exam city: learner picks from the states already present in backend/src/data/spocStats.json chapters.
  3) Hall ticket number format: HT26-<COURSE CODE without NOC26->-<STATE 2-letter>-<6-digit sequence>, e.g. HT26-CS01-TN-000001.
  4) Duplicate registration (same email + course) returns the existing hall ticket, HTTP 200, not an error.
  5) Closed registration returns 409 NPTEL_ERR_EXAM_REGISTRATION_CLOSED.
  ```
  Then:
  ```text
  /plan
  Plan the full-stack change:
  - Backend: POST /api/exams/registrations {courseId, learnerName, email, examState} -> 201 {hallTicketNumber, course, examDate, examState};
    GET /api/exams/registrations/:hallTicketNumber -> 200 or 404 NPTEL_ERR_HALL_TICKET_NOT_FOUND. New router backend/src/routes/exams.ts mounted in backend/src/server.ts.
    Validate courseId with the same pattern as backend/src/routes/courses.ts and email with a simple regex.
  - Frontend: a "Register for Proctored Exam" button in frontend/src/components/CourseClassroom.tsx next to the exam date,
    a labelled form (GIGW: explicit <label htmlFor>, aria-live error region), and a printable hall-ticket card (@media print hides header/footer).
    Add types to frontend/src/types/nptel.ts. Use relative /api URLs (vite proxy), not http://localhost:4000.
  - Tests: backend/test/exams.test.ts covering 201, duplicate -> 200 same number, closed (noc26-hs06) -> 409, bad email -> 400, unknown ticket -> 404.
  Acceptance: `npm test` and `npm --prefix frontend run build` pass; registering for noc26-cs01 in the UI shows a hall ticket I can print.
  ```
  **Inline comment** to add on the plan artifact. Highlight the storage / persistence step:
  ```text
  Don't write registrations into backend/src/data/*.json — concurrent writes will corrupt it and it mixes seed data with user data.
  Put storage behind an ExamRegistrationStore interface in backend/src/services/examRegistrationStore.ts with an in-memory
  implementation for now, so we can swap in Postgres later. Tests must create a fresh store per test.
  ```
  Second inline comment, on the frontend step:
  ```text
  Mask the email on the printed hall ticket (a****@domain) — hall tickets get photographed and shared.
  ```
  Then click **Proceed**. Leave it running and move on to S5/S6. Come back at the end of S7.
- **What to point at on screen:**
  - `/grill-me` asking only questions that matter. Your answers become constraints.
  - The **implementation plan artifact** rendering.
  - Your two **inline comments**, and the agent **revising the plan** (the in-memory store and masked email appear).
  - The Plan Review Policy forcing a pause before any code exists.
  - The conversation continuing in the background while you present S5–S7.
- **Expected output / artifacts:** Plan → task list → a new `routes/exams.ts`, `services/examRegistrationStore.ts`, `test/exams.test.ts`, and edits to `server.ts`, `CourseClassroom.tsx` and `types/nptel.ts`, followed by a walkthrough. **Verify (when you return):**
  - `npm test` is green.
  - In the UI, *noc26-cs01 → Register* produces something like `HT26-CS01-TN-000001`.
  - For noc26-hs06 the button is disabled or the request returns 409.
- **Talking point:** "I spent 90 seconds marking up a plan the way I'd mark up a junior's design doc, and those two comments changed the architecture before a line was written. Then I walked away. It's still building while I show you the next thing."
- **Claude Code comparison:** This is Claude Code's plan mode plus an interview-first prompt. What Antigravity adds is that the plan is an artifact you comment on inline, line by line, with a project-level policy that forces plan review.
- **Est. time:** 7 min live (execution runs in the background, 10–20 min) · **Risk:** Med (long run) · **Fallback:** `git switch demo/s4-exam-registration-done` and show the pre-run walkthrough · **Reset:** `git switch -f demo/s4-exam-registration && git reset --hard demo-baseline && git clean -fd -- backend frontend`

---

### Scenario 5 (optional): Dropped-week indicator with Tab completion

- **Antigravity features showcased:** Tab completion, agent side panel, inline diff
- **Surface:** IDE (JetBrains extension with GE Preview **or** Antigravity IDE with a personal account; see §3)
- **Why NPTEL devs care:** Learners keep asking "which of my weeks counted?" The code to show it already exists but has been disabled with `&& false`.
- **Starting state:** `git switch demo/s5-dropped-week`. Open `frontend/src/components/CourseClassroom.tsx` and jump to the `isDropped` block in the grading tab (search for `&& false`).
- **Prompt(s) to paste:** Delete the `isDropped` expression and type `const isDropped =`, then let **Tab** propose the completion. Then in the side panel:
  ```text
  In CourseClassroom.tsx the isDropped flag for each week card is dead code (`&& false`). Implement it properly:
  a week is dropped if its score is NOT among gradingResult.selectedBestAssignments, handling ties
  (if two weeks both score 80 and only one 80 is selected, only the later week is dropped).
  Show dropped cards with the existing slate styling plus a small "Not counted (Best {bestNCount} of {durationWeeks})" caption,
  and add aria-describedby so screen readers hear it. Keep it a pure helper function above the component.
  ```
- **What to point at on screen:** Ghost-text Tab suggestions, the side panel's inline diff, and the dropped weeks greying out live in Chrome when you move a score.
- **Expected output / artifacts:** A helper function plus card styling. **Verify:** in an 8-week course with defaults `[85,90,78,92,88,60,95,80]`, the weeks scoring **60** and **78** are greyed out.
- **Talking point:** "Not everything needs an agent run. Tab plus a 2-line side-panel ask is the cheapest way to spend quota."
- **Claude Code comparison:** Claude Code has no inline Tab completion of its own. Developers pair it with their editor's completion. Here completion and agent run on the same Google model and account. ⚠️ State plainly that **the standalone Antigravity IDE isn't supported on Enterprise accounts**.
- **Est. time:** 3 min · **Risk:** Med (account/surface) · **Fallback:** Cut it. It's the first cut · **Reset:** `git switch -f demo/s5-dropped-week && git reset --hard demo-baseline`

---

### Scenario 6: Mobile and accessibility verification with the browser agent

- **Antigravity features showcased:** Browser subagent driving Chrome, **browser recording**, screenshots, **comments on an image region**, the separate Chrome profile, the URL allowlist (default `localhost`), and app undo
- **Surface:** app
- **Why NPTEL devs care:** Much of NPTEL's audience is on phones, and GIGW compliance is mandatory for a government portal. Having an agent click through the actual UI and record it replaces a manual QA pass.
- **Starting state:** `git switch demo/s6-mobile-a11y`. Dev server running.
- **Prompt(s) to paste:**
  ```text
  /browser
  Open http://localhost:5173 in a 390x844 (mobile) viewport and record the session.
  Walk this path: catalog -> try to reach the "Exams" and "Courses" menus from the header -> open "Enter Classroom" on
  noc26-cs01 -> switch transcript to தமிழ் and हिन्दी -> go to Certificate Verification and verify NPTEL26CS01S1049201.
  Take a screenshot at each step. Report (do not fix yet):
  - navigation that is unreachable on mobile (check frontend/src/components/Header.tsx, the nav is `hidden md:flex`)
  - whether the Tamil/Hindi transcript blocks carry a lang attribute (WCAG 3.1.2)
  - tap targets under 44px and any horizontal scroll
  ```
  When the screenshot of the mobile header appears, **draw a box around the empty area to the right of the logo** and comment:
  ```text
  Add a hamburger here (aria-expanded, aria-controls) that opens the same five menus as a stacked drawer; Escape closes it and returns focus to the button.
  ```
  Then:
  ```text
  Fix the issues you reported in Header.tsx and CourseClassroom.tsx (lang="ta"/"hi" on the transcript and caption blocks).
  Do not change desktop layout at >=768px. Then re-run the same browser path and record it again so I can compare.
  ```
- **What to point at on screen:**
  - The agent physically clicking through the app in the separate Chrome profile.
  - The screenshots appearing as artifacts.
  - Your **region comment** on the image.
  - The **two recordings side by side**: before, there was no way to reach the "Exams" menu; after, there is a hamburger.
  - Mention that the allowlist starts with only `localhost`, so the agent can't wander to random sites.
- **Expected output / artifacts:** Recordings (before and after), screenshots, edits to `Header.tsx` and `CourseClassroom.tsx`, and a walkthrough. **Verify:** at 390 px the drawer opens with all 5 menus, and in DevTools the transcript `<div>` has `lang="ta"` when Tamil is selected. Also run `npm --prefix frontend run build`.
- **Talking point:** "I didn't write a Playwright script. The agent produced the evidence, a video, which I can attach to the PR. I steered the fix by drawing on its screenshot."
- **Claude Code comparison:** Claude Code can drive Chrome through its Chrome integration or a Playwright/DevTools MCP. Antigravity's browser agent is built in, records video artifacts, and lets you comment directly on screenshot regions.
- **Est. time:** 7 min · **Risk:** Med–High (browser timing, extra quota) · **Fallback:** Play the pre-recorded video from the T-1 run (Save Video) and `git switch demo/s6-mobile-a11y-done` · **Reset:** `git switch -f demo/s6-mobile-a11y && git reset --hard demo-baseline` (or undo in the app, choosing "revert files + conversation")

---

### Scenario 7: Three agents in parallel. Transcript search, OpenAPI docs, test coverage

- **Antigravity features showcased:** Parallel conversations in one Project, **git worktrees**, dynamic subagents, **messaging a subagent directly**, `/agents`, async background tasks, `/goal` (CLI)
- **Surface:** app (lanes A and C) and CLI (lane B), side by side
- **Why NPTEL devs care:** A sprint has three independent tickets. They can run all three at once in isolated worktrees, review each separately and merge, instead of doing them one after another.
- **Starting state:** `demo-baseline`. Use branches `demo/s7a-transcript-search`, `demo/s7b-openapi` and `demo/s7c-tests`. The worktree option is on. Start a background `npm run dev` in the embedded terminal if it isn't already running.
- **Prompt(s) to paste:**

  **Lane A (app, conversation 1, worktree on `demo/s7a-transcript-search`):**
  ```text
  Add lecture transcript search to the classroom.
  Backend: GET /api/courses/:id/transcripts/search?q=&lang=en|ta|hi in backend/src/routes/courses.ts — returns
  [{weekNumber, videoTitle, timestamp, snippet}] where timestamp is the nearest preceding "[mm:ss]" marker in the transcript text.
  Reuse COURSE_ID_PATTERN and the envelope helpers; 400 on q shorter than 2 chars.
  Frontend: a search box above the transcript card in frontend/src/components/CourseClassroom.tsx; clicking a hit selects that week
  and scrolls to/highlights the snippet with <mark>. Must work for Tamil and Hindi text.
  Spawn a subagent to write backend/test/transcripts.test.ts in parallel while you build the UI
  (cases: "Euclid" en hit in noc26-cs01 week 1 with timestamp "00:00" or "01:15", Hindi query, q="a" -> 400, bad course id -> 400).
  ```
  **Lane B (CLI, terminal on `demo/s7c-tests`):**
  ```bash
  git worktree add ../nptel-s7c demo/s7c-tests && cd ../nptel-s7c && npm --prefix backend install && agy
  ```
  ```text
  /goal Raise confidence in backend/src/services/gradingService.ts: add table-driven tests in backend/test/grading.test.ts for
  every tier boundary (totals 39/40, 59/60, 74/75, 89/90 including .5 rounding via Math.round), assignment threshold exactly 10/25,
  exam threshold exactly 30/75, fewer submissions than bestNCount (zero padding), and simulateMedalTargets consistency:
  for durations 4/8/12 and uniform scores 0..100 step 5, scoring exactly requiredExamScoreOut100 must reach the milestone tier.
  Do not change production code; if a test exposes a bug, mark it with test.todo and explain. Done when `npm --prefix backend test` is green.
  ```
  **Lane C (app, conversation 2, worktree on `demo/s7b-openapi`):**
  ```text
  Write an OpenAPI 3.1 spec for every route mounted in backend/src/server.ts at backend/openapi.yaml.
  Model the shared envelope ({success, nptelMeta{semester, coordinatingInstitute, timestamp}, data} / {success:false, nptelMeta, error{code,message}})
  as reusable components, include every NPTEL_ERR_* code each route can return, and give examples using real seed IDs
  (noc26-cs01, NPTEL26CS01S1049201, LC-TN-0014). Then add a node:test in backend/test/openapi.test.ts that parses
  server.ts router mounts + router.get/post calls and fails if any route is missing from the spec (no new npm deps; a tiny YAML path regex is fine).
  ```
  **Message a subagent directly** (lane A, once the test subagent appears):
  ```text
  @<test subagent> also cover a Tamil query — use a word from noc26-cs01 week 1 "ta" transcript, e.g. "யூக்ளிட்".
  ```
  Then in the CLI:
  ```text
  /agents
  ```
- **What to point at on screen:**
  - Two app conversations and a CLI session **all streaming at once**.
  - The **subagent card** appearing in lane A, and you messaging it mid-flight.
  - `/agents` listing running work.
  - Each lane in its own worktree or branch, so they can't overwrite each other.
  - The dev server running as a background task throughout.
  - Then **flip back to S4** and show it finished while you were presenting.
- **Expected output / artifacts:**
  - A: a route, UI and `transcripts.test.ts`
  - B: expanded `grading.test.ts`, green
  - C: `backend/openapi.yaml` + `openapi.test.ts`
  - **Verify:** `npm --prefix backend test` passes in each worktree. In lane A, searching "Euclid" jumps to Week 1.
- **Talking point:** "Three tickets, three isolated worktrees, one reviewer: me. The agent decided on its own to spin up a test-writing subagent, and I could talk to that subagent directly. This is where the quota pays for itself."
- **Claude Code comparison:** Claude Code also has subagents, background tasks and worktree isolation. Antigravity adds a GUI manager for several top-level conversations per Project, subagent cards you can message from the box, and `/goal` for run-to-done in the CLI.
- **Est. time:** 7 min (lanes keep running, so check results at the end) · **Risk:** Med–High (load, quota) · **Fallback:** Run lane B only, and show the `-done` branches for A and C · **Reset:** `git worktree remove ../nptel-s7c --force` (look at it first), then for each branch `git switch -f demo/s7x-… && git reset --hard demo-baseline`

---

### Scenario 8: Performance deep pass (show the pre-run result)

- **Antigravity features showcased:** `/boost` (pre-run), `/teamwork-preview` (talk-through only)
- **Surface:** app
- **Why NPTEL devs care:** On exam-result day, traffic spikes hit the catalog and grade calculator first.
- **Starting state:** The pinned conversation from the T-1 pre-run.
- **Prompt(s) to paste (run at T-1, not live):**
  ```text
  /boost
  Find and fix the top performance problems in this portal under exam-result-day load, with measurements.
  Known suspects: every route in backend/src/routes/*.ts calls fs.readFileSync + JSON.parse per request;
  frontend/src/components/CourseClassroom.tsx fires two POSTs (calculate + simulate-medals) on every slider onChange;
  App.tsx downloads all certificates (with student names) on boot just to show demo pills;
  CourseCatalog filters client-side while /api/courses already supports server-side filters.
  For each fix: before/after numbers (autocannon-style loop with node's fetch is fine, no new deps), and keep all tests green.
  Propose, don't implement, anything that changes API shape.
  ```
- **What to point at on screen:** The strategy → parallel attempts → verification → synthesis structure, and the before/after table. Then open the `/teamwork-preview` docs page and explain its roles (Sentinel, Explorers, Workers, Critic/Challenger/Auditor) for multi-day work.
- **Expected output / artifacts:** A cached-loader module for `backend/src/data`, a debounced grading effect, and the certificate list removed from boot (or reduced to IDs only), with numbers. **Verify:** the tests on the pre-run branch are green.
- **Talking point:** "`/boost` is the expensive tool, so I ran it last night. Use it for problems like 'why is this slow under load' that need several hypotheses tested, not for renaming a variable."
- **Claude Code comparison:** The nearest Claude Code equivalent is fanning out subagents or a multi-agent workflow yourself. `/boost` packages that strategy, parallel attempts and verification behind one command.
- **Est. time:** 2 min · **Risk:** Low (pre-run) · **Fallback:** Show the diff of the pre-run branch · **Reset:** n/a

---

### Scenario 9: SPOC analytics as a live chart

- **Antigravity features showcased:** Generative UI (inline HTML widget with Chart.js)
- **Surface:** app
- **Why NPTEL devs care:** Coordinators constantly ask questions like "which chapters convert enrolments into exam registrations?". This answers one without building a dashboard first.
- **Starting state:** `demo-baseline`. No code changes.
- **Prompt(s) to paste:**
  ```text
  Read backend/src/data/spocStats.json. Render an inline interactive Chart.js widget (not a file):
  a horizontal bar chart of exam-registration conversion (examRegistered / enrolledStudents, %) per local chapter,
  coloured by state, sorted descending, with tooltips showing collegeName, SPOC and Elite+Gold count.
  Below it, a one-line insight. Use NPTEL maroon #990000 for the top bar.
  ```
  Follow-up:
  ```text
  Add a toggle to switch the metric to Elite+Gold per 1,000 enrolled. Then tell me what it would take to put this into frontend/src/components/SpocDashboard.tsx without adding a chart dependency — just the plan.
  ```
- **What to point at on screen:** The chart rendering **inside the chat**, hover tooltips, the metric toggle, and the agent's sizing of the change to `SpocDashboard.tsx`.
- **Expected output / artifacts:** An inline widget. **Verify:** the order is **LC-KA-0081 RVCE (≈75.1%)** > LC-TN-0042 PSG (≈74.0%) > LC-MH-0108 COEP (≈72.4%) > LC-TN-0014 CEG (≈71.8%) > LC-TS-0029 (≈69.3%).
- **Talking point:** "This is a throwaway analysis: no PR, no dashboard ticket. When a coordinator emails a question, you answer it with a chart in two minutes."
- **Claude Code comparison:** Claude Code in the terminal would write a script or HTML file for you to open. Antigravity renders the interactive chart inline in the conversation.
- **Est. time:** 4 min · **Risk:** Low · **Fallback:** Ask for Plotly instead · **Reset:** none

---

### Scenario 10: Team conventions as code. Rules, a skill, a subagent and hooks

- **Antigravity features showcased:** `AGENTS.md` with `@path` references, Agent Skills invoked as `/slash` commands, a custom subagent, JSON lifecycle hooks (PreToolUse deny, PostToolUse verify), `/permissions`, sensitive-path protection
- **Surface:** app and CLI
- **Why NPTEL devs care:** This is the part they can adopt tomorrow. It writes the team's unwritten rules (envelope, error codes, IST, no PII, immutable certificates) into files that every agent run obeys.
- **Starting state:** `git switch demo/s10-team-kit`. Copy in the take-home kit files from §6 and commit. Restart the conversation so the customizations load. The repo already has `GEMINI.md` and `.agents/hooks.json`. The kit **adds** `AGENTS.md` and new keys to `hooks.json` and does not replace them.
- **Prompt(s) to paste:**
  1. **Skill as a slash command (app):**
     ```text
     /nptel-api-endpoint GET /api/courses/:id/syllabus — returns the course's weeks without transcripts
     ({weekNumber, title, videoTitle, durationMinutes, assignmentTitle}) for lightweight mobile listing.
     ```
  2. **Hook: issued certificates are immutable (app):**
     ```text
     Learner Ananya Subramanian appealed. Change her badgeTier to "Elite + Silver" in backend/src/data/certificates.json.
     ```
  3. **Custom subagent (CLI):**
     ```bash
     agy --agent nptel-grading-auditor -p "Review the uncommitted diff against demo-baseline for grading-rule violations." --output-format text
     ```
  4. **Inspect permissions:**
     ```text
     /permissions
     ```
- **What to point at on screen:**
  - The agent **following the skill's checklist** (`sendNptelError` codes, `.js` import suffix, a test in `backend/test`).
  - **PostToolUse** running backend tests after each backend edit.
  - The **PreToolUse hook denying** the certificate edit with your reason text. The agent explains that issued certificates need a re-issue flow instead.
  - The subagent's read-only findings.
  - `/permissions` showing project versus global rules.
  - Mention the built-in sensitive-path protection (`.git/`, `~/.ssh`, destructive commands), which stops agents from rewriting git history.
- **Expected output / artifacts:** A new route plus a test (from the skill), a denied edit (the hook) and an audit report (the subagent). **Verify:**
  - `git diff --stat` shows **no change** to `certificates.json`.
  - `curl -s localhost:4000/api/courses/noc26-cs01/syllabus | jq '.data | length'` returns `4`.
- **Talking point:** "AGENTS.md is the 'what', skills are the 'how', hooks are the 'you can't'. Your rules ship with the repo in `.agents/`, so every developer and every Automation gets the same guardrails."
- **Claude Code comparison:** These map one-to-one: AGENTS.md to CLAUDE.md, `.agents/skills` to `.claude/skills`, `.agents/agents/*.md` to `.claude/agents/*.md`, and `hooks.json` PreToolUse/PostToolUse to Claude Code hooks. The concepts carry over almost directly. Antigravity's hooks have richer PreToolUse decisions (`auto_approve`, `force_ask`, `deny_unless_prior_grant`) and rules support `glob`/`model_decision` triggers.
- **Est. time:** 7 min · **Risk:** Med (customization reload) · **Fallback:** Show the files and `agy agents` listing. Demo only the hook deny · **Reset:** `git switch -f demo/s10-team-kit && git reset --hard demo-baseline`

---

### Scenario 11: Domain tools via MCP, and plugins from the Marketplace

- **Antigravity features showcased:** MCP server registration (`agy mcp add` / `.agents/mcp_config.json`), the Marketplace / Customizations tab, the Build with Google **Chrome DevTools** plugin, `agy plugin import`, and sidecars/UI extensions (mentioned only)
- **Surface:** CLI and app
- **Why NPTEL devs care:** NPTEL depends on systems the model can't know about: SWAYAM, ABC credits, Bhashini, exam-centre capacity. MCP is how those become tools. This repo already ships a stdio MCP server for them.
- **Starting state:** `demo-baseline`. Chrome DevTools plugin pre-installed.
- **Prompt(s) to paste:**
  ```bash
  agy mcp add -e NPTEL_COORDINATING_INSTITUTE="IIT Madras" -e NPTEL_SEMESTER="Jul-Nov 2026" \
    nptel-swayam -- node "$PWD/scripts/mcp/nptel-swayam-mcp-server.mjs"
  agy mcp list
  agy
  ```
  ```text
  Using the nptel-swayam MCP tools only (no file edits):
  1) check_bhashini_translation_status for every course id in backend/src/data/courses.json;
  2) simulate_exam_center_capacity for noc26-cs01 with 84520 projected learners;
  3) lookup_abc_credit_mapping for an 8-week AICTE-FDP course.
  Summarise as a table and flag which SPOC states in backend/src/data/spocStats.json (Maharashtra, Karnataka, Telangana)
  lack a transcript language today (we only ship en/ta/hi).
  ```
  Then in the app:
  ```text
  Use the Chrome DevTools plugin to profile http://localhost:5173 catalog load and the classroom grade slider:
  report long tasks, network waterfall for /api calls, and the top 3 fixes. No code changes.
  ```
  Then mention, without running it:
  ```bash
  agy plugin import claude   # 🟡 imports compatible plugins from a Claude Code setup — confirm scope first
  ```
- **What to point at on screen:** The MCP tool calls with structured headers. The **Customizations tab → Build with Google** shelf (Chrome DevTools, Modern web guidance, Google Cloud, Firebase, Data Agent Kit, etc.). The DevTools trace findings: expect the duplicate grading POSTs to show up. Briefly, the sidecars docs page as the "always-on background process" option.
- **Expected output / artifacts:** An MCP results table, and a DevTools performance summary that matches G9/G10. **Verify:** `agy mcp list` shows `nptel-swayam`.
- **Talking point:** "Bhashini, SWAYAM and exam-centre tools become something the agent can call, and the same MCP server works in Claude Code too. Plugins bundle skills, MCP, subagents, rules and hooks into one install. You can even import ones you already use."
- **Claude Code comparison:** MCP is the same open protocol: `agy mcp add` is like `claude mcp add`, and `mcp_config.json` is like `.mcp.json`. Both tools have plugin marketplaces. Antigravity's distinctive pieces are the curated Build with Google bundles and `agy plugin import` from Claude.
- **Est. time:** 5 min · **Risk:** Med (MCP startup, admin MCP allowlist) · **Fallback:** Run the server once by hand, or show the tool list from `scripts/mcp/nptel-swayam-mcp-server.mjs` · **Reset:** `agy mcp remove nptel-swayam`

---

### Scenario 12 (closer): Nightly guard, run from your phone

- **Antigravity features showcased:** Automations (create, Run Now), Remote Control with push notification and approval from the phone, `/resume`, `/usage`. `/schedule` is mentioned as the CLI equivalent.
- **Surface:** app, phone (Remote Control) and CLI
- **Why NPTEL devs care:** Dependency CVEs and contract drift don't wait for office hours. Before exam weekends, someone also needs to check in from a phone.
- **Starting state:** `git switch demo/s12-automation`. Remote Control is enabled and the phone is paired (§3).
- **Prompt(s) to paste:** Go to **Automations → new** (or "Create with Prompt" 🟡). Name it **"Nightly NPTEL guard"** and set it to daily at **07:00 IST**:
  ```text
  In the NPTEL Portal project:
  1) Run `npm audit --omit=dev --json` in backend/ and frontend/; list high/critical advisories with the fix version.
  2) Run `npm test` and `npm --prefix frontend run build`.
  3) Run the headless contract audit: every route in backend/src/routes must validate inputs and use sendNptelError for errors;
     list any new route without a test in backend/test.
  4) Produce a walkthrough titled "NPTEL nightly guard <date>" with a pass/fail table. Do not modify files or push anything.
  If a high/critical advisory has a non-breaking fix, open a branch named nightly/deps-<date> with only the lockfile change and stop for review.
  ```
  Click **Run Now**. From the **phone**, open Remote Control. Show the run streaming, then **approve** the branch-creation prompt (or the network permission for `npm audit`) from the phone. Wait for the push notification when it finishes. Then on the laptop:
  ```bash
  agy
  ```
  ```text
  /resume
  ```
  Pick the S4 conversation, then:
  ```text
  /usage
  ```
- **What to point at on screen:** The Automation card with its schedule and History. The phone mirroring a live laptop session. **Approving from the phone.** The push notification. `/resume` picking up earlier work. `/usage` (note that Enterprise may not show per-model quotas).
- **Expected output / artifacts:** A walkthrough artifact in History, and possibly a `nightly/deps-*` branch. **Verify:** the History entry exists and the phone showed the approval.
- **Talking point:** "This runs every morning before you open your laptop. You review the result over coffee from your phone, approve the one safe change, and the risky ones wait for you."
- **Claude Code comparison:** Claude Code has scheduled cloud routines and its own Remote Control. Antigravity's Automations run your **local** Project on a cron, with Run Now, and Remote Control lets you approve permissions from the phone with push notifications.
- **Est. time:** 6 min · **Risk:** Med (network, phone pairing) · **Fallback:** Show a T-1 Run Now result in History, and screenshots of the phone flow · **Reset:** Delete the automation. `git branch -D nightly/deps-*` (check `git branch` first)

---

## 6. Take-home kit (ready to commit)

> These files coexist with the existing `GEMINI.md`, `.agents/rules/`, `.agents/skills/` and `.agents/hooks.json`. Review them against `GEMINI.md` for contradictions before committing. Schemas follow the docs (✅) unless marked 🟡.

### 6.1 `AGENTS.md` (repo root) ✅ location
```markdown
# NPTEL Portal — Agent Rules

## Project map
- Backend: Express 4 + TypeScript ESM (NodeNext). Relative imports MUST end in `.js` (e.g. `../utils/apiResponse.js`).
- Frontend: React 18 + Vite + Tailwind, no router (tabs live in `frontend/src/App.tsx`).
- Seed data: `backend/src/data/*.json`. Treat `certificates.json` as issued, immutable records.
- API envelope: @backend/src/utils/apiResponse.ts
- Grading rules: @backend/src/services/gradingService.ts

## API conventions (non-negotiable)
- Every response goes through `sendNptelSuccess(res, data, status?)` or `sendNptelError(res, code, message, status)`. Never `res.json` directly.
- Error codes are `NPTEL_ERR_<UPPER_SNAKE>`; 400 for validation, 404 for missing, 409 for state conflicts.
- Validate ALL inputs (params, query, every array element) before touching data. Numbers: `Number.isFinite` and explicit ranges.
- Course IDs: `/^noc\d{2}-[a-z]{2}\d{2}$/i`. Certificate IDs: `/^NPTEL\d{2}[A-Z]{2}\d{2}S\d{7}$/i`. Reuse the existing constants.
- New routers: `backend/src/routes/<domain>.ts`, default-export a `Router`, mount in `backend/src/server.ts` under `/api/<domain>`.
- Dates/times are IST (`Asia/Kolkata`); say "IST" in user-facing strings.

## Grading invariants (do not change without an ADR)
- Best 3/4, 6/8, 8/12 weekly assignments; missing weeks count as 0.
- Assignment out of 25, exam out of 75; qualify only if >= 10/25 AND >= 30/75.
- Tiers on rounded total: 40 Successfully Completed, 60 Elite, 75 Elite + Silver, 90 Elite + Gold.
- `frontend/src/types/nptel.ts` mirrors backend types by hand: update both in the same change.

## Privacy
- No Aadhaar, phone numbers or full emails in logs, responses lists, or printed artifacts. Mask emails (`a****@domain`).
- Never return all learner records from an unauthenticated list endpoint.

## Frontend
- Call the API with relative `/api/...` URLs (Vite proxies to :4000). Do not add new `http://localhost:4000` literals.
- GIGW 3.0 / WCAG 2.1 AA: explicit `<label htmlFor>`, `aria-pressed` on toggles, `aria-current` on nav, `aria-live="polite"` for result counts,
  `lang="ta"` / `lang="hi"` on regional text, visible focus, 44px tap targets, works at 360px width.
- Brand colours: maroon `#990000` / `#7b1f23`. Reuse existing Tailwind patterns; no new UI libraries.

## Verify before you say "done"
- `npm --prefix backend test`
- `npm run validate:catalog` (if `courses.json` changed)
- `npm --prefix frontend run build`
- Tests use `node:test` + `node:assert/strict`; HTTP tests reuse the `apiFetch` pattern in `backend/test/api.test.ts`.
```

### 6.2 Skill: `.agents/skills/nptel-api-endpoint/SKILL.md` ✅ location/frontmatter
```markdown
---
name: nptel-api-endpoint
description: Add or change a REST endpoint in the NPTEL portal backend following the envelope, error-code, validation and test conventions. Use when asked to add, extend or fix an /api route.
---

# Add an NPTEL API endpoint

1. **Locate or create the router** in `backend/src/routes/<domain>.ts` (default-export `Router()`); mount new routers in `backend/src/server.ts` as `app.use('/api/<domain>', router)`. Imports end in `.js`.
2. **Validate first.** Reuse `COURSE_ID_PATTERN` (courses.ts) / `CERT_ID_PATTERN` (certificates.ts). For bodies, check type, finiteness and range of every element. Reject with `sendNptelError(res, 'NPTEL_ERR_<CODE>', '<human message naming the rule>', 400)`.
3. **Respond** only via `sendNptelSuccess(res, data, status)`. 201 for creates, 409 for state conflicts (e.g. registration closed).
4. **No PII in list responses**; mask emails.
5. **Types:** if the response shape is consumed by the frontend, add/extend the interface in `frontend/src/types/nptel.ts`.
6. **Tests:** add a `describe` in `backend/test/<domain>.test.ts` (or `api.test.ts` for small changes) covering 200/201, each 400 code, 404, and one boundary value. Reuse the `apiFetch` + in-process fallback pattern from `backend/test/api.test.ts`; if you need it in a second file, extract it to `backend/test/helpers.ts` rather than copy it again.
7. **Docs:** if `backend/openapi.yaml` exists, add the path and examples using real seed IDs (`noc26-cs01`, `NPTEL26CS01S1049201`).
8. **Verify:** run `npm --prefix backend test` and paste the summary line. Report the endpoint with one `curl` example.
```

### 6.3 Skill: `.agents/skills/nptel-grading-tests/SKILL.md`
```markdown
---
name: nptel-grading-tests
description: Write boundary-focused tests for the NPTEL Best-N grading engine and medal simulator. Use when gradingService.ts or /api/grading changes, or when asked to raise grading test coverage.
---

# Grading test recipe

Target: `backend/src/services/gradingService.ts`, tests in `backend/test/grading.test.ts` (`node:test`, `node:assert/strict`).

Write table-driven cases (array of `{name, input, expect}` + loop) for:
- **Best-N selection** per duration 4/8/12, including ties and fewer submissions than N (zero padding).
- **Qualification edges:** assignment exactly 10/25 and 9.99; exam exactly 30/75 (examScoreOut100 = 40) and 39.
- **Tier edges on the rounded total:** 39.5 → 40, 59.49 → 59, 74.5 → 75, 89.5 → 90 (`Math.round`), and a qualified learner with total < 40.
- **Clamping:** negative, >100, NaN inputs at the service level (the API should already reject them — assert both layers).
- **Simulator consistency:** for each duration and uniform scores 0..100 step 5, feeding `requiredExamScoreOut100` back into `calculateNptelGrade` reaches the milestone tier; `achievable=false` milestones really are unreachable at 100.

Rules: never edit production code in this skill; if a test exposes a bug, use `test.todo('<bug description>')` and report it. Finish with `npm --prefix backend test`.
```

### 6.4 Skill: `.agents/skills/nptel-a11y-audit/SKILL.md`
```markdown
---
name: nptel-a11y-audit
description: Audit a NPTEL portal page or component for GIGW 3.0 / WCAG 2.1 AA and mobile issues, using the browser at 360px and 1280px. Use for accessibility, mobile or GIGW compliance requests.
---

# NPTEL accessibility audit

1. Ensure `npm run dev` is running; open http://localhost:5173 in the browser at **360x800** and **1280x800**. Record the session.
2. For the requested tab(s) (catalog, classroom, certificates, spoc) check and screenshot:
   - Every control reachable and operable by keyboard; visible focus; logical tab order; Escape closes menus.
   - Header navigation reachable below 768px (`frontend/src/components/Header.tsx`).
   - `lang="ta"` / `lang="hi"` on Tamil/Hindi transcript and caption blocks (`CourseClassroom.tsx`).
   - Labels: `<label htmlFor>` on inputs; `aria-pressed` on toggle buttons; `aria-current` on active tab; `aria-live="polite"` on counts/results.
   - Contrast >= 4.5:1 for text (watch `text-slate-500` on 11px text), >= 3:1 for UI components.
   - Tap targets >= 44x44px at 360px; no horizontal scroll.
   - Buttons with identical text (e.g. multiple "Enter Classroom") have distinguishing accessible names.
3. Output a table: `Issue | WCAG SC | File:line | Severity | Fix`. Do not edit files unless asked; when asked, fix and re-record.
```

### 6.5 Custom subagent: `.agents/agents/nptel-grading-auditor.md` ✅ location. 🟡 the `rules:`/`hooks:` keys and relative-path resolution
```markdown
---
name: nptel-grading-auditor
description: Read-only reviewer for changes touching grading, certificates or exam logic. Flags violations of NPTEL Best-N, 25/75, dual-threshold and tier rules, missing validation, PII leaks, and missing tests. Use before merging any grading/certificate/exam change.
tools:
  - view_file
  - grep_search
  - find_by_name
  - list_dir
  - run_command
mainAgent: true
subagent: true
model: pro
commandExecutionPolicy: sandbox
skills:
  - ../skills/nptel-grading-tests
---

You are a strict reviewer for the IIT Madras NPTEL portal. You never edit files.

Review scope: the current uncommitted diff (`git diff`) plus `git diff demo-baseline...HEAD` if that tag exists.

Check, citing file:line for each finding:
1. Grading invariants in backend/src/services/gradingService.ts: Best 3/4, 6/8, 8/12; out of 25/75; >= 10/25 AND >= 30/75; tiers 40/60/75/90 on Math.round total.
2. Every changed /api route validates all inputs and uses sendNptelSuccess / sendNptelError with NPTEL_ERR_* codes.
3. No change to backend/src/data/certificates.json (issued records are immutable).
4. No PII (full email, phone, Aadhaar) in responses, logs or printed views.
5. frontend/src/types/nptel.ts kept in sync with backend types.
6. New behaviour has tests; run `npm --prefix backend test` and report the summary.

Output: a table `Severity | Finding | File:line | Suggested fix`, then "APPROVE" or "REQUEST CHANGES".
```

### 6.6 Hooks: add these keys to `.agents/hooks.json` (keep the two existing keys) ✅ schema and events. 🟡 hook working directory
```json
{
  "nptel-issued-certificates-immutable": {
    "PreToolUse": [
      {
        "matcher": "write_to_file|replace_file_content|multi_replace_file_content",
        "hooks": [
          { "type": "command", "command": "node ./hooks/guard-issued-certificates.mjs", "timeout": 5 }
        ]
      }
    ]
  },
  "nptel-backend-tests-after-edit": {
    "PostToolUse": [
      {
        "matcher": "write_to_file|replace_file_content|multi_replace_file_content",
        "hooks": [
          { "type": "command", "command": "node ./hooks/run-backend-tests.mjs", "timeout": 120 }
        ]
      }
    ]
  }
}
```

`.agents/hooks/guard-issued-certificates.mjs`
```js
#!/usr/bin/env node
/**
 * PreToolUse: block agent edits to issued e-certificates. Re-issues must go through a reviewed flow.
 * Reads the hook payload (JSON) from stdin; prints a decision JSON on stdout.
 */
import { readFileSync } from 'node:fs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  // Unparseable input: don't block.
}

const args = JSON.stringify(payload.toolCall?.args ?? {});
if (args.includes('backend/src/data/certificates.json')) {
  process.stdout.write(
    JSON.stringify({
      decision: 'deny',
      reason:
        'backend/src/data/certificates.json holds issued NPTEL e-certificates and is immutable. ' +
        'Propose a re-issue/appeal flow (new certificate ID, audit trail) instead of editing the record.',
    }) + '\n'
  );
} else {
  process.stdout.write('{}\n');
}
```

`.agents/hooks/run-backend-tests.mjs`
```js
#!/usr/bin/env node
/**
 * PostToolUse: after an edit under backend/, run the backend test suite and surface failures.
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  // Unparseable input: treat as no-op.
}

const args = JSON.stringify(payload.toolCall?.args ?? {});
if (args.includes('backend/')) {
  const res = spawnSync('npm', ['--prefix', 'backend', 'test'], { cwd: repoRoot, encoding: 'utf8' });
  if (res.status !== 0) {
    const tail = `${res.stdout}\n${res.stderr}`.split('\n').slice(-40).join('\n');
    process.stderr.write(`[NPTEL backend tests FAILED after edit]\n${tail}\n`);
  }
}

process.stdout.write('{}\n');
```
> 🟡 Confirm whether PostToolUse stderr is shown to the agent, the user, or both. Also note that the PreToolUse guard does not catch shell edits (`sed -i`) through `run_command`. Default-preset sandboxing and code review cover that path.

### 6.7 Automation idea: "Nightly NPTEL guard"
- **Where:** app → Automations → New. **Schedule:** daily, 07:00 IST. **Project:** NPTEL Portal. **Permission preset:** Default (sandbox), so it can't push.
- **Prompt:** use the S12 prompt exactly.
- **CLI variant (🟡 auth in CI):** `agy -p "<same prompt>" --output-format json --print-timeout 15m | jq -r '.status'` from a cron or CI runner. CI needs ADC sign-in (`AGY_ADC_AUTH`); confirm with Google that GE licences cover headless ADC use.

---

## 7. Quota tips for a Gemini Enterprise allocation

1. **Default to Flash and step up deliberately.** Gemini 3.8 Flash with low or medium `/effort` covers most edits, reviews and Q&A. Save Argon or 3.1 Pro and high effort for planning (S4) and multi-file features (S7).
2. **Plan first, then let it run.** `/plan` with a review policy costs one planning pass and saves the expensive cycle of building the wrong thing and rebuilding. Use `/goal` only when the spec and the "done" check (a test command) are crisp. Open-ended goals can run indefinitely, since the CLI removed its max limit.
3. **Keep context lean.**
   - Use `@file` for specific files instead of "look at the repo".
   - Start new conversations per ticket.
   - Use `/btw` for detours.
   - Use `/compact` in the CLI on long threads.
   - Check `/context`.
   - Keep `AGENTS.md` tight, since always-on rules share a 20k-token budget.
4. **Know the premium buttons.** The docs flag `/boost`, `/teamwork-preview`, browser use and image generation as consuming more.
   - **Don't use `/boost`** for single-file fixes, renames, test scaffolding, or anything whose correct answer is obvious once you know where to look.
   - Use it for load issues, race conditions and cross-module refactors.
5. **Use headless for repeatable checks.** `agy -p … --json-schema` audits are short, scripted and cheap compared with interactive exploration.
6. **Push work to skills and hooks.** A skill that already knows the conventions spends fewer tokens rediscovering them, and a hook running tests catches failures before the agent iterates blindly.
7. **Watch usage.** Use `/usage` and `/credits` (or Settings). 🟡 Enterprise accounts may not show per-model quotas, so ask the GE admin for the tenant-level view. Third-party Claude models on GE are **billed per token** on top of the licence if the admin enables them.

---

## 8. Likely audience questions

| Question | Crisp answer | Confirm with Google? |
|---|---|---|
| **Is our code used to train models? What about data privacy?** | With Gemini Enterprise sign-in, Antigravity runs under **Google Cloud Terms of Service**. Telemetry and interactions are logged to the **selected Google Cloud project** you control. | **Yes.** Get the written no-training / data-retention statement for Antigravity under the IITM GE contract. |
| **What can our admins control?** | Admin policies cover allowed models, MCP allowlists and browser features (v2.5.0+). Sign-in supports Google Cloud SSO, Workforce Identity Federation (BYO IdP) and ADC for headless use. Remote Control can be gated by policy. | Yes. Get the exact policy list for the IITM tenant. |
| **Which models do we get?** | The docs list Gemini 4 Argon, Gemini 3.8, 3.7 and 3.6 Flash, and Gemini 3.1 Pro for Enterprise. **Claude Opus/Sonnet 5.5** are available only if an admin opts in through the Cloud Console, and they are billed per token. | **Yes.** Show the tenant's actual picker. |
| **Where does inference run?** Can it stay in India? | Global, US or EU. Third-party models run in global, US or EU only, and the docs say "in-country regions are not supported." There is no India region listed. | **Yes.** Data-residency questions go to Google. |
| **How is this different from Claude Code, which we already use?** | The concepts overlap heavily: rules files, skills, subagents, hooks, MCP, plan mode, headless JSON, rewind. Antigravity adds review artifacts you can comment on inline, a built-in browser agent with video, GUI multi-conversation management with worktrees, Generative UI, Automations in the app, and Gemini Enterprise governance. Claude Code is a mature terminal-first agent your team already trusts. **Use both.** Your MCP servers carry over, and `agy plugin import` can bring in Claude plugins 🟡. | No, but stay fair. |
| **We're on a restricted campus network or proxy.** | Allowlist `businessaicode.googleapis.com`, `discoveryengine.googleapis.com` and regional variants on TCP 443. mTLS endpoints (`*.mtls.googleapis.com`) are available. CLI 1.3.3+ shows the proxy's page title on HTML error pages, which helps debugging. The browser agent needs Chrome and only reaches allowlisted URLs. | Yes. Get the full endpoint list for the tenant region. |
| **Will it cope with our large NPTEL monorepo?** | Use `/codesearch` for semantic search. Use multi-folder Projects so you only add the services you touch. Directory-scoped rules load as the agent walks up from edited files. Use `@path` references instead of pasting. Run subagents in `branch` worktrees for isolation, and `/compact` for long sessions. Start with a read-only headless audit to calibrate. | No. |
| **Can it run in CI?** | Yes. Use `agy -p` with `--output-format json` or `stream-json`, `--json-schema` and `--print-timeout`. Headless runs soft-deny tool permissions unless they are allowed in settings. | Yes, confirm ADC/licence terms for CI. |
| **Can we use the Antigravity IDE?** | Not with Enterprise accounts, per the docs. Use the **app**, the **CLI**, or the **JetBrains / Zed / Xcode** extensions, where GE sign-in is in Preview. | Yes, check the roadmap. |
| **Is it safe to let it run commands?** | The Default preset sandboxes terminal file and network access, protects sensitive paths (`.git/`, `~/.ssh`) and blocks destructive commands. On top of that you can add PreToolUse hooks that deny specific actions (S10). | No. |

---

## 9. Appendix

### Slash-command cheat sheet
| Command | Use it for | Surface |
|---|---|---|
| `/plan` | Draft an implementation plan to review and comment on before code | app, CLI ✅ |
| `/grill-me` | Agent interviews you before designing | app 🟡 CLI |
| `/goal` | Run to completion without check-ins (needs a crisp "done") | CLI ✅ / app 🟡 |
| `/btw` | One-off side question, doesn't derail the thread | app, CLI ✅ |
| `/boost` | Deep multi-agent reasoning pass (paid, costs more) | app, CLI ✅ |
| `/teamwork-preview` | Multi-agent team for large projects (paid, preview) | app, CLI ✅ |
| `/browser` | Force browser use | 🟡 |
| `/schedule` | Turn a prompt into a recurring run | CLI 🟡 syntax |
| `/effort` | Set reasoning effort | CLI ✅ |
| `/codesearch` | Semantic code search panel | CLI ✅ |
| `/context` | Inspect context-window usage | CLI ✅ |
| `/compact` | Summarise the conversation to free context | CLI ✅ (1.3.5) |
| `/diff` | Uncommitted changes viewer (`f` whole file, `Ctrl+O` fold) | CLI ✅ |
| `/rewind` | Roll back to an earlier message or checkpoint | CLI ✅ |
| `/permissions` | View and edit allow rules | CLI ✅ |
| `/resume` | Reopen a past conversation | CLI ✅ |
| `/agents` | List and monitor subagents | CLI ✅ |
| `/voice` | Dictation | CLI ✅ |
| `/usage`, `/credits` | Quota and AI credits | CLI ✅ |
| `/plugin`, `/mcp`, `/config`, `/remote-control`, `/add-dir`, `/model` | Manage plugins, MCP, settings, Remote Control, folders, model | CLI ✅ |
| `/<skill-name>` | Invoke any Agent Skill, e.g. `/nptel-api-endpoint` | app, CLI ✅ |

### Useful CLI flags (✅ from `agy --help`)
`-p/--print`, `--output-format text|json|stream-json`, `--json-schema`, `--print-timeout`, `--mode plan|accept-edits|auto`, `--effort low|medium|high|max`, `--model`, `--agent`, `--add-dir`, `--sandbox`, `--remote-control`, `-c/--continue`, `--conversation`. Subcommands: `agy mcp add|list|remove`, `agy plugin install|import|list`, `agy remote-control start|status|stop`, `agy models`, `agy update`, `agy changelog`.

### Keyboard shortcuts
| Action | macOS | Source |
|---|---|---|
| Settings | `Cmd + ,` | ✅ docs (Remote Control page) |
| Toggle embedded terminal | `Cmd + `` ` | ✅ changelog v2.10 |
| Quote selected text as context | `Cmd + L` / `Cmd + I` | ✅ changelog v2.13 |
| Search conversations | `Cmd + F` | ✅ changelog v2.1.4 |
| Archive conversation | `Cmd + Option + A` | ✅ changelog v2.23 |
| Cycle agent mode (CLI: plan / accept-edits / auto) | `Shift + Tab` | ✅ CLI 1.3.5 |
| Monitor subagents (CLI) | `Alt + J` | ✅ subagents docs |
| `/diff`: expand fold / whole file | `Ctrl + O` / `f` | ✅ CLI 1.3.5 |
| Interrupt the agent | `Esc` | ✅ CLI changelog |
| Accept Tab completion (IDE) | `Tab` | ✅ |

### Cut order if time runs short
1. **S5** (IDE Tab completion): surface caveats for Enterprise, lowest wow factor.
2. **S9** (Generative UI): fun but not core to their workflow. Mention it in one sentence.
3. **S2** (headless audit): fold the CLI story into S3, and mention `--json-schema` verbally.
