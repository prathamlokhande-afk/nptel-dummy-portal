# ADR-001: Official NPTEL 25/75 Grading Engine & Standardized REST API Envelope

- **Status:** Accepted
- **Date:** 2026-10-15
- **Deciders:** IIT Madras NPTEL Engineering & Architecture Team
- **Technical Story:** Standardization of certification eligibility computation and REST API response contracts across the NPTEL Online Certification Portal.

---

## 1. Context and Problem Statement

The National Programme on Technology Enhanced Learning (**NPTEL**), coordinated by **IIT Madras**, serves millions of learners and over 5,000+ SWAYAM Local Chapters across India. Academic credit transfer under UGC and AICTE regulations depends on two critical engineering invariants:

1. **Strict Dual-Threshold Certification Grading**: A learner cannot pass an NPTEL course solely through high assignment scores or solely through a high final exam score. Furthermore, weekly assignments follow a course-duration-dependent "Best-N" policy (`Best 3 of 4`, `Best 6 of 8`, or `Best 8 of 12`). Any floating-point rounding drift, client-side calculation discrepancy, or missing threshold check could result in erroneous certificate issuance.
2. **Consistent API Contract for Web, Mobile, and SPOC Integrations**: Frontend views, QR certificate verifiers, and SWAYAM Local Chapter (SPOC) dashboards consume multiple backend endpoints (`/api/courses`, `/api/grading`, `/api/certificates`, `/api/spoc`). Unstructured or inconsistent JSON responses complicate error handling, auditability, and client type safety.

---

## 2. Decision Drivers

- **Academic Integrity & Determinism**: Grading calculations must be 100% deterministic, side-effect-free, and testable in isolation.
- **Regulatory Compliance**: Must enforce the official NPTEL Information Brochure rules for Best-N assignment selection, dual qualifying thresholds, and medal tiers (`Elite + Gold`, `Elite + Silver`, `Elite`, `Successfully Completed`).
- **API Predictability & Observability**: Every REST response must carry consistent status indicators, version/semester metadata, and structured error codes (`NPTEL_ERR_*`).
- **AI & Developer Governance**: Architectural decisions must be machine-enforceable via Antigravity workspace rules (`.agents/rules/nptel-grading-and-api.md`) and CI pipelines.

---

## 3. Decisions

### Decision 1: Pure, Deterministic TypeScript Grading Service (`calculateNptelGrade`)

We encapsulate all grading logic inside a pure, stateless TypeScript domain service (`backend/src/services/gradingService.ts`) exposing `calculateNptelGrade`.

1. **Best-N Weekly Assignment Selection**:
   - `4-week` course: `bestCount = 3` highest scores out of 4 weekly assignments.
   - `8-week` course: `bestCount = 6` highest scores out of 8 weekly assignments.
   - `12-week` course: `bestCount = 8` highest scores out of 12 weekly assignments.
2. **Component Scaling**:
   - **Assignment Score (out of 25)**:
     $$\text{assignmentScoreOutOf25} = \text{round}_2\left(\frac{\text{Average of Best-}N\text{ Assignments}}{100} \times 25\right)$$
   - **Proctored Exam Score (out of 75)**:
     $$\text{examScoreOutOf75} = \text{round}_2\left(\frac{\text{Proctored Exam Score (out of 100)}}{100} \times 75\right)$$
   - **Final Composite Score (out of 100)**:
     $$\text{finalScore} = \text{round}\left(\text{assignmentScoreOutOf25} + \text{examScoreOutOf75}\right)$$
3. **Dual Qualifying Criterion**:
   - A learner qualifies for an NPTEL certificate **if and only if**:
     - `assignmentScoreOutOf25 >= 10.0` (i.e., $\ge 40\%$ of 25) **AND**
     - `examScoreOutOf75 >= 30.0` (i.e., $\ge 40\%$ of 75).
   - If either threshold is missed (even if the combined total exceeds 60 or 75), `qualified` is `false` and the learner receives `No Certificate`.
4. **Certificate Tier & Medal Assignment (when qualified)**:
   - `finalScore >= 90`: `Elite + Gold`
   - `finalScore >= 75`: `Elite + Silver`
   - `finalScore >= 60`: `Elite`
   - `finalScore >= 40`: `Successfully Completed`

### Decision 2: Standardized JSON Envelope Across All REST Endpoints

All `/api/*` endpoints must return a standardized JSON response envelope containing explicit status, payload `data` (or structured `error`), and institutional metadata (`meta` / `nptelMeta` with ISO-8601 `timestamp` and API `version: "v1"`):

```json
{
  "success": true,
  "status": "success",
  "data": { ... },
  "meta": {
    "timestamp": "2026-10-15T00:00:00.000Z",
    "version": "v1"
  },
  "nptelMeta": {
    "semester": "Jul-Nov 2026",
    "coordinatingInstitute": "IIT Madras",
    "timestamp": "2026-10-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

On validation (`400`) or resource-not-found (`404`) errors, endpoints return a structured `error` object (`code: "NPTEL_ERR_<CODE>"`, `message`) without exposing internal stack traces or learner PII.

---

## 4. Consequences & Verification

### Positive Consequences
- **Zero Discrepancy Between Simulator & Certificate Issuance**: Both interactive classroom score calculators and backend verification routes rely on the exact same domain rules.
- **High Testability**: Pure function design allows exhaustive unit testing of boundary conditions (`9.99` vs `10.0` assignment score, `29.99` vs `30.0` exam score, and `4`/`8`/`12` week arrays).
- **Automated Governance**: Antigravity agents automatically apply `.agents/rules/nptel-grading-and-api.md` whenever editing `backend/src/routes/**` or `backend/src/services/**`.

### Verification Mechanisms
1. **Automated Unit & Integration Tests (`backend/test/`)**: Executed via `npm --prefix backend test` using Node's native test runner (`node:test`).
2. **Antigravity Rules & Skills**:
   - `.agents/rules/nptel-grading-and-api.md` enforces envelope structure, course ID regex validation (`/^noc\d{2}-[a-z]{2}\d{2}$/i`), and IST timezone conventions.
   - `.agents/skills/nptel-security-checklist/SKILL.md` verifies input validation bounds and zero-PII logging.
3. **Continuous Integration Gate (`.github/workflows/ci.yml`)**: Blocks merges to `main` if any grading test, course catalog check, or TypeScript build fails.
