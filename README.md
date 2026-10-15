# NPTEL Online Certification Portal (IIT Madras) — Antigravity Showcase

A full-stack replica of the **NPTEL Online Certification & Multilingual Learning Portal** coordinated by **IIT Madras**, purpose-built to showcase **Google Antigravity** (IDE, Antigravity 2.0, `.agents/` Rules/Skills/Hooks, Subagents, Browser Automation, and Generative UI) to the IIT Madras engineering team.

## Quick Start

```bash
# 1. Start both Backend API (http://localhost:4000) and Frontend Portal (http://localhost:5173)
npm run dev

# 2. Run Backend Unit Tests + NPTEL Course Catalog Validator
npm test
```

## Key Demo & Leave-Behind Resources

- **[Live Presenter Runbook (`docs/LIVE_DEMO_SCRIPT.md`)](./docs/LIVE_DEMO_SCRIPT.md)** — Minute-by-minute walkthrough, keyboard shortcuts, and exact copy-paste prompts for the 6-Act IIT Madras demo.
- **[IIT Madras Antigravity Playbook (`docs/IITM_ANTIGRAVITY_PLAYBOOK.md`)](./docs/IITM_ANTIGRAVITY_PLAYBOOK.md)** — Take-home cheat sheet for the IITM engineering team.
- **[Wireframe Asset (`demo-assets/medal-simulator-wireframe.png`)](./demo-assets/medal-simulator-wireframe.png)** — Ready-to-drag-and-drop UI mockup for Act 2 (`/plan` + multimodal context).
- **Workspace Customizations (`.agents/` & `GEMINI.md`)**:
  - [`GEMINI.md`](./GEMINI.md) — Root repository architecture and official NPTEL grading rules.
  - [`.agents/rules/nptel-grading-and-api.md`](./.agents/rules/nptel-grading-and-api.md) — Enforces standard `{ success, nptelMeta, data }` API envelopes and `noc26-*` course ID validation.
  - [`.agents/rules/gigw-accessibility.md`](./.agents/rules/gigw-accessibility.md) — Enforces Govt. of India GIGW 3.0 & WCAG 2.1 AA accessibility standards.
  - [`.agents/skills/nptel-course-ingestor/SKILL.md`](./.agents/skills/nptel-course-ingestor/SKILL.md) — Custom skill + validator script (`validate-course.mjs`) for onboarding new IIT/IISc courses.
  - [`.agents/skills/nptel-security-checklist/SKILL.md`](./.agents/skills/nptel-security-checklist/SKILL.md) — Security audit skill for exam & certificate verification endpoints.
  - [`.agents/hooks.json`](./.agents/hooks.json) — Post-write lifecycle hook that validates `courses.json` on edit.

## Demo State Switching (`demo-reset.sh`)

```bash
# Stage intentional demo hooks (e.g., AICTE FDP + search filter bug for Act 4)
npm run demo:stage-hooks

# Restore 100% clean, passing state at any time
npm run demo:clean
```
