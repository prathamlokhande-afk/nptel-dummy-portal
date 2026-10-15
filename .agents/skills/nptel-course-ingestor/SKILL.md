---
name: nptel-course-ingestor
description: Onboard and validate a new IIT/IISc course into the NPTEL catalog (backend/src/data/courses.json) with compliant noc26-* IDs, week-by-week modules, AICTE FDP metadata, and regional Bhashini transcript placeholders.
---

# NPTEL Course Onboarding & Ingestion Skill

Use this skill whenever an educator, SME, or developer asks to onboard, add, or ingest a new course into the NPTEL portal catalog.

## Step 1: Construct a Compliant Course Schema
Every course added to `backend/src/data/courses.json` MUST include:
- `id`: Lowercase `noc26-<dept><2-digit-num>` (e.g., `noc26-cs07`, `noc26-ee09`).
- `code`: Uppercase display code (e.g., `NOC26-CS07`).
- `title`: Full official course title.
- `instructor`: Faculty name with title (e.g., `Prof. V. Kamakoti`).
- `institute`: Partner institution (`IIT Madras`, `IIT Bombay`, `IIT Kharagpur`, `IISc Bangalore`, etc.).
- `discipline`: Discipline name (e.g., `Computer Science & Engineering`, `Electrical Engineering`, `Multidisciplinary`).
- `durationWeeks`: Must be strictly `4`, `8`, or `12`.
- `credits`: `1` (for 4 weeks), `2` (for 8 weeks), or `3` (for 12 weeks).
- `aicteFdpApproved`: Boolean indicating if approved for AICTE Faculty Development Programme.
- `examRegistrationOpen`: Boolean.
- `examDate`: ISO date or formatted IST date string (e.g., `"2026-11-22 (09:00 IST)"`).
- `enrollments`: Initial enrollment count (default `1250` for newly launched courses).
- `completionRate`: Percentage `0`–`100`.
- `weeks`: Array of week modules (`weekNumber`, `title`, `videoTitle`, `durationMinutes`, `assignmentTitle`, `transcripts` with `en`, `ta`, and `hi` entries).

## Step 2: Run the Catalog Validator Script
After updating `backend/src/data/courses.json`, ALWAYS execute the validation script to verify schema integrity and NPTEL grading compatibility:

```bash
node .agents/skills/nptel-course-ingestor/scripts/validate-course.mjs
```

## Step 3: Report Summary
Output a clean summary table showing the newly added `id`, `title`, `instructor`, `durationWeeks`, `credits`, and validation status.
