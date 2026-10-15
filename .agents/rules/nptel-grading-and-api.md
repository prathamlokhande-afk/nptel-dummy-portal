---
trigger: always_on
description: Enforces NPTEL REST API response envelopes, error codes, and IIT Madras grading invariants across backend routes and services.
---

# NPTEL Backend API & Grading Standards

Whenever creating or modifying backend routes (`backend/src/routes/**`) or services (`backend/src/services/**`), strictly follow these standards:

## 1. Standard NPTEL API Envelope
Every JSON response from `/api/*` MUST use the `sendNptelResponse` helper or return the standard envelope:
```json
{
  "success": true,
  "nptelMeta": {
    "semester": "Jul-Nov 2026",
    "coordinatingInstitute": "IIT Madras",
    "timestamp": "2026-10-15T00:00:00.000Z"
  },
  "data": { ... }
}
```
On validation or not-found errors (`400` / `404`), return:
```json
{
  "success": false,
  "nptelMeta": {
    "semester": "Jul-Nov 2026",
    "coordinatingInstitute": "IIT Madras",
    "timestamp": "2026-10-15T00:00:00.000Z"
  },
  "error": {
    "code": "NPTEL_ERR_<CODE>",
    "message": "Human-readable explanation"
  }
}
```

## 2. Course ID Validation
Validate `:id` route parameters against `/^noc\d{2}-[a-z]{2}\d{2}$/i` before querying data stores.

## 3. Timezone & Localization
- Represent all exam dates and assignment deadlines in **IST (`Asia/Kolkata`, UTC+05:30)**.
- Preserve regional language transcript keys (`en`, `ta`, `hi`) when returning lecture data.
