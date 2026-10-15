# Google Antigravity Playbook for the IIT Madras (NPTEL) Engineering Team

Welcome! This handbook is designed as a practical take-home reference for the **IIT Madras NPTEL & SWAYAM development team** to get the maximum engineering velocity, code quality, and institutional consistency out of **Google Antigravity**.

---

## 1. Choosing the Right Modality for the Task

| Modality | Shortcut / Trigger | Best Used For in NPTEL Workflows |
| :--- | :--- | :--- |
| **Antigravity Tab & Supercomplete** | <kbd>Tab</kbd> | Next-intent multi-line edits, propagating schema changes across TypeScript/Python models, **Tab-to-Jump** across files, and **Tab-to-Import**. |
| **Inline Command** | <kbd>⌘</kbd>+<kbd>I</kbd> (macOS) / <kbd>Ctrl</kbd>+<kbd>I</kbd> | Highlighting a specific function (e.g., grading formula, SQL query, React filter) to refactor, add docstrings, or handle edge cases with an inline visual diff. |
| **Inline Code Lenses** | Click lens above function/class | 1-click **"Write Tests"**, **"Refactor"**, or **"Explain"** on individual methods. |
| **Planning Mode** | `/plan` in Chat Canvas | Multi-file features (e.g., adding a new SPOC analytics view + REST API + DB migration). Generates a reviewable **Artifact** with Mermaid diagrams first. |
| **Parallel Subagents** | Prompt or `/teamwork-preview` | Running independent workstreams concurrently (e.g., Security Audit + Unit Tests + Accessibility Check). |

---

## 2. High-Leverage Slash Commands

Type `/` in the Chat Canvas to trigger specialized workflows:

- **`/plan`** — Investigates the codebase and produces a step-by-step Implementation Plan Artifact before touching code.
- **`/grill-me`** — Interviews you with targeted architectural questions to uncover edge cases (e.g., *"What should happen if a learner registers for both morning and afternoon exam shifts?"*) before implementation.
- **`/boost`** — Engages deep, multi-perspective reasoning and verification for complex distributed-systems or performance bugs.
- **`/browser`** — Launches browser automation to interact with your local web app, inspect the DOM, and verify fixes visually.
- **`/learn`** — Persists a correction or project convention you just taught the agent into your customization files so you never have to repeat yourself.
- **`/schedule`** — Creates a one-shot timer or recurring cron automation (e.g., daily health checks or issue triage).
- **`/compact`** — Summarizes and compacts a long conversation thread to free up context window space.

---

## 3. Checking Your Team's Brain into Git (`.agents/`)

The highest-ROI practice for a team with full-time staff, faculty coordinators, and rotating project associates is checking a `.agents/` directory into your repository root:

```text
your-nptel-repo/
├── GEMINI.md                              # Root architectural & domain overview
└── .agents/
    ├── rules/
    │   ├── nptel-grading-and-api.md       # Always-on or model-triggered API & grading rules
    │   └── gigw-accessibility.md          # Govt of India GIGW 3.0 & WCAG 2.1 AA rules
    ├── skills/
    │   ├── nptel-course-ingestor/
    │   │   ├── SKILL.md                   # Step-by-step runbook loaded on-demand
    │   │   └── scripts/validate-course.mjs
    │   └── nptel-security-checklist/
    │       └── SKILL.md                   # Pre-release security & IDOR audit checklist
    ├── hooks.json                         # Automated post-edit / pre-command lifecycle hooks
    └── mcp_config.json                    # Connect databases, issue trackers, & Chrome DevTools
```

### Why Progressive Disclosure Matters
- **Rules** (`always_on`) keep critical invariants (like NPTEL's 25/75 grading rule and API response envelope) active at all times.
- **Skills** (`skills/<name>/SKILL.md`) use **progressive disclosure**: only their short `name` and `description` are shown to the model initially, and the full runbook + scripts are loaded *only* when the task actually requires them. You can maintain 50+ specialized IITM operational skills without bloating your context window!
