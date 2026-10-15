---
name: nptel-bhashini-sync
description: Audits, synchronizes, and exports Bhashini multilingual lecture transcripts (English, Tamil, Hindi, Telugu) and WebVTT (.vtt) closed captions across the NPTEL course catalog. Use when auditing translation coverage, adding new regional language transcripts, or generating WebVTT subtitle endpoints for NPTEL video lectures.
---

# NPTEL Bhashini Multilingual Transcript & WebVTT Sync Skill

This skill automates the multi-step workflow used by the IIT Madras NPTEL translation engineering team to audit Bhashini ASR/NMT lecture transcripts, preserve English technical terminology inside regional scripts, and expose WebVTT (`.vtt`) closed-caption streams for rural and low-bandwidth learners.

## 1. Mandatory Pre-Flight Audit

Before modifying any lecture transcripts or adding subtitle endpoints, run the deterministic Bhashini coverage auditor:

```bash
node .agents/skills/nptel-bhashini-sync/scripts/audit-bhashini-coverage.mjs backend/src/data/courses.json
```

The auditor inspects every course (`noc26-*`) and every weekly module in `backend/src/data/courses.json`, reporting:
- Language coverage percentages across required (`en`, `ta`, `hi`) and extended (`te`, `kn`, `bn`, `mr`, `ml`) Indian languages.
- Character length ratios to detect truncated or placeholder NMT translations.
- Missing week modules or empty strings.

## 2. Translation & Technical Glossary Standards

When generating or repairing regional transcripts (`ta`, `hi`, `te`, etc.):
1. **Domain Term Preservation**: Keep universal mathematical constants, complexity classes (`O(n log n)`, `NP-Hard`), protocol acronyms (`HTTP`, `TCP/IP`, `Qubit`, `MOSFET`), and SI units (`kW`, `MHz`, `m/s^2`) either in parenthetical English or standard transliteration so engineering students can map concepts directly to the NPTEL proctored exam.
2. **Minimum Completeness**: Every regional transcript must be at least 30 characters long and accurately summarize the core syllabus topics of that week.
3. **Zero Data Loss**: Never overwrite or delete existing `en`, `ta`, or `hi` keys when adding a new regional language key (such as `te` for Telugu).

## 3. WebVTT (`.vtt`) Closed-Caption Endpoint Standard

When asked to expose downloadable or streamable subtitles for the NPTEL video player in `backend/src/routes/courses.ts`:
- Route signature: `GET /api/courses/:id/subtitles/:week/:lang`
- Validate `:id` against `/^noc\d{2}-[a-z]{2}\d{2}$/i`.
- Validate `:lang` against supported Bhashini codes (`en`, `ta`, `hi`, `te`).
- Return standard JSON envelope via `sendNptelResponse` containing `{ courseId, week, language, vttContent }` formatted as compliant `WEBVTT`:
  ```text
  WEBVTT - NPTEL Bhashini Closed Captions (IIT Madras)

  00:00:00.000 --> 00:00:15.000
  <Regional Transcript Segment>
  ```

## 4. Post-Sync Verification

After updating transcripts or adding the WebVTT endpoint:
1. Re-run `node .agents/skills/nptel-bhashini-sync/scripts/audit-bhashini-coverage.mjs backend/src/data/courses.json`.
2. Run `node .agents/skills/nptel-course-ingestor/scripts/validate-course.mjs backend/src/data/courses.json`.
3. Run `npm test` to confirm all backend unit and API tests pass.
