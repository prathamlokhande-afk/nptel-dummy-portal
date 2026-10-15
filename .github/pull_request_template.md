## Summary of Changes

<!-- Provide a concise description of the feature, bug fix, or course catalog update introduced in this Pull Request. -->

### Related Issue / ADR
- Reference: <!-- e.g., ADR-001, Issue #12, or Course Onboarding Request -->

---

## 1. NPTEL Domain & 25/75 Grading Compliance (`.agents/rules/nptel-grading-and-api.md`)
- [ ] **Course ID Nomenclature**: All new or modified course IDs strictly match `/^noc\d{2}-[a-z]{2}\d{2}$/i` (e.g., `noc26-cs01`).
- [ ] **Best-N Assignment Policy**: Grading logic preserves Best 3 of 4 (4-week), Best 6 of 8 (8-week), and Best 8 of 12 (12-week) selection rules.
- [ ] **Dual Qualifying Thresholds**: Certificate eligibility enforces both `assignmentScoreOutOf25 >= 10.0` (40% of 25) AND `examScoreOutOf75 >= 30.0` (40% of 75).
- [ ] **Standardized API Envelope**: All `/api/*` endpoints return the standard JSON response envelope with `nptelMeta` / `meta` (`timestamp`, `version: "v1"`, `coordinatingInstitute: "IIT Madras"`).
- [ ] **IST Localization & Bhashini Keys**: Exam dates/deadlines use `Asia/Kolkata` (UTC+05:30) and lecture transcripts preserve `en`, `hi`, and `ta` keys.

## 2. GIGW 3.0 & WCAG 2.1 AA Accessibility Checklist (`.agents/rules/gigw-accessibility.md`)
- [ ] **Interactive Controls & ARIA**: All icon-only buttons, filter pills, and language switchers include explicit `aria-label` or `aria-pressed` attributes.
- [ ] **Form Labels & Validation**: Search inputs and score calculators have explicit `<label htmlFor="...">` bindings and use `:user-invalid` / `:user-valid` rather than `:invalid`.
- [ ] **Semantic Progress & Live Regions**: Course completion indicators use semantic `<progress>` elements and dynamic score/filter updates announce via `aria-live="polite"`.
- [ ] **Contrast & Text Selection**: Color contrast meets `4.5:1` (body text) / `3:1` (UI components), and `user-select: none` is never applied to transcripts, syllabi, or certificate details.

## 3. OWASP API Security & Zero-PII Audit (`.agents/skills/nptel-security-checklist/SKILL.md`)
- [ ] **Score Input Bounds**: Grading endpoints validate numeric arrays (`0 <= score <= 100`, `Number.isFinite`) and reject `NaN`/`Infinity` or out-of-range payloads with `400 Bad Request`.
- [ ] **Zero-PII Logging**: No Aadhaar numbers, personal phone numbers, learner email addresses, or residential addresses are written to console or error logs.
- [ ] **IDOR & Enumeration Safety**: Certificate verification and SPOC analytics routes expose only authorized public/institutional fields.

## 4. Automated Verification & CI Gates
- [ ] **Catalog Schema Validator**: `node .agents/skills/nptel-course-ingestor/scripts/validate-course.mjs backend/src/data/courses.json` passes with 0 errors.
- [ ] **Backend Test Suite**: `npm --prefix backend test` passes all unit and API integration tests.
- [ ] **Frontend Production Build**: `npm --prefix frontend run build` compiles TypeScript and Vite assets cleanly with 0 errors.
