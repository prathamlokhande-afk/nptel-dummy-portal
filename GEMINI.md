# NPTEL Portal (IIT Madras) — Engineering & Agent Guidelines

This repository contains the full-stack **NPTEL Online Certification Portal** coordinated by **IIT Madras** (Indian Institute of Technology Madras) under the Ministry of Education (MoE), Government of India.

## 1. Repository Structure

- `backend/` — Node.js + Express + TypeScript REST API (`http://localhost:4000`)
  - `src/data/` — Seed data for IIT/IISc courses, Bhashini multilingual transcripts, certificates, and Local Chapter (SPOC) analytics.
  - `src/services/gradingService.ts` — Official NPTEL Certification & Medal calculation engine.
  - `src/routes/` — Express route handlers (`/api/courses`, `/api/grading`, `/api/certificates`, `/api/spoc`).
  - `test/` — Unit and API tests using Node's built-in `node:test` runner (`npm test`).
- `frontend/` — React 18 + Vite + TypeScript + Tailwind CSS (`http://localhost:5173`)
  - `src/components/` — Modular UI components (Header, CourseCatalog, CourseClassroom, CertificateVerifier, SpocDashboard).
  - `src/types/` — Shared TypeScript interfaces for NPTEL entities.
- `.agents/` — Workspace-scoped Antigravity customizations (Rules, Skills, and Hooks) shared across the IIT Madras engineering team.

## 2. Core Domain Standards

1. **Course Nomenclature**: All NPTEL course codes must follow the pattern `noc26-<discipline><number>` (e.g., `noc26-cs01`, `noc26-ee14`, `noc26-hs08`).
2. **Official NPTEL Grading Formula**:
   - **Final Score (100)** = **Assignment Score (out of 25)** + **Proctored Exam Score (out of 75)**.
   - **Best-N Assignments Policy**:
     - 4-Week Course: Best **3** out of 4 weekly assignments.
     - 8-Week Course: Best **6** out of 8 weekly assignments.
     - 12-Week Course: Best **8** out of 12 weekly assignments.
   - **Dual Qualifying Criterion**: A learner is eligible for a certificate **ONLY IF** `assignmentScoreOut25 >= 10` (i.e. >= 40% of 25) **AND** `examScoreOut75 >= 30` (i.e. >= 40% of 75).
   - **Certificate Badge Tiers** (when qualified):
     - `Total >= 90`: `Elite + Gold`
     - `Total >= 75`: `Elite + Silver`
     - `Total >= 60`: `Elite`
     - `Total >= 40`: `Successfully Completed`
3. **Browser Support Policy**: Assume a modern execution environment where Baseline Newly Available features can be used natively, provided they are strictly feature-detected and degrade gracefully.
