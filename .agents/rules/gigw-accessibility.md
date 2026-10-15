---
trigger: always_on
description: Enforces Government of India Websites Guidelines (GIGW 3.0) and WCAG 2.1 AA accessibility standards on all NPTEL frontend components.
---

# GIGW 3.0 & WCAG 2.1 AA Accessibility Rules (NPTEL Frontend)

NPTEL serves learners across urban and rural India, including learners using assistive technologies and low-bandwidth connections. All frontend edits in `frontend/src/**` MUST follow these rules:

1. **Interactive Controls & ARIA**:
   - Every icon-only button, filter pill, or language switcher MUST have an explicit `aria-label` or `aria-pressed` state.
   - Search inputs and score calculators MUST use explicit `<label htmlFor="...">` associations.
2. **Semantic Progress & Status**:
   - Use semantic `<progress>` elements for course completion rings and score bars.
   - Announce dynamic grading calculations or filter result counts using `aria-live="polite"`.
3. **Color Contrast & Visual Theming**:
   - Maintain at least `4.5:1` contrast ratio for body text and `3:1` for UI components.
   - Use `:user-invalid` and `:user-valid` instead of `:invalid` and `:valid` on form inputs so empty fields are not flagged as errors on initial page load.
   - Never apply `user-select: none` to lecture transcripts, syllabus text, or certificate details.
