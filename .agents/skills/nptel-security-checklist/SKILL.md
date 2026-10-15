---
name: nptel-security-checklist
description: Audits NPTEL backend API endpoints (grading, hall tickets, certificate verification, and SPOC analytics) for OWASP vulnerabilities, IDOR, rate-limiting, and exam score manipulation risks.
---

# NPTEL Security & Exam Integrity Audit Skill

Activate this skill when asked to review or audit backend API routes (`backend/src/routes/**`) or grading services (`backend/src/services/**`) before an NPTEL Exam Registration or Result Release milestone.

## Audit Checklist

1. **Certificate Verification Enumeration / IDOR (`GET /api/certificates/:certId`)**:
   - Check that `:certId` is strictly validated against the official NPTEL format (`/^NPTEL\d{2}[A-Z]{2}\d{2}S\d{7}$/`).
   - Ensure internal learner PII (personal phone numbers, Aadhaar, raw email addresses) is never leaked in public QR verification responses.
2. **Grading Calculation Tampering (`POST /api/grading/calculate`)**:
   - Verify all assignment scores and exam scores are clamped/validated within `[0, 100]` numeric bounds (`Number.isFinite`).
   - Verify `durationWeeks` is strictly validated (`4`, `8`, or `12`) so an attacker cannot pass `durationWeeks: 1` to bypass the Best-N assignment rule.
3. **Standard Response Envelope**:
   - Confirm all error responses use standard `NPTEL_ERR_*` codes without exposing internal stack traces.
