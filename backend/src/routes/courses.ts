import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendNptelError, sendNptelSuccess } from '../utils/apiResponse.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coursesFilePath = path.resolve(__dirname, '../data/courses.json');

const COURSE_ID_PATTERN = /^noc\d{2}-[a-z]{2}\d{2}$/i;

function loadCourses() {
  const raw = fs.readFileSync(coursesFilePath, 'utf8');
  return JSON.parse(raw);
}

/**
 * GET /api/courses
 * Supports filtering by search, discipline, durationWeeks, institute, and aicteFdpApproved
 */
router.get('/', (req, res) => {
  const courses = loadCourses();
  const { search, discipline, durationWeeks, institute, aicteFdpApproved } = req.query;

  let filtered = [...courses];

  if (typeof search === 'string' && search.trim().length > 0) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (Array.isArray(c.tags) && c.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  }

  if (typeof discipline === 'string' && discipline !== 'All') {
    const normalizeDiscipline = (val: string) =>
      val.toLowerCase().replace(/\band\b/g, '&').replace(/\s+/g, ' ').trim();
    filtered = filtered.filter(
      (c) => normalizeDiscipline(c.discipline) === normalizeDiscipline(discipline)
    );
  }

  if (typeof durationWeeks === 'string' && durationWeeks !== 'All') {
    const weeksNum = Number(durationWeeks);
    if (Number.isFinite(weeksNum)) {
      filtered = filtered.filter((c) => c.durationWeeks === weeksNum);
    }
  }

  if (typeof institute === 'string' && institute !== 'All') {
    filtered = filtered.filter((c) =>
      c.institute.toLowerCase().includes(institute.toLowerCase())
    );
  }

  if (aicteFdpApproved === 'true') {
    filtered = filtered.filter((c) => c.aicteFdpApproved === true);
  }

  sendNptelSuccess(res, {
    totalCount: filtered.length,
    courses: filtered,
  });
});

/**
 * GET /api/courses/:id
 * Returns full course details including weekly lectures and Bhashini regional transcripts
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!COURSE_ID_PATTERN.test(id)) {
    sendNptelError(
      res,
      'NPTEL_ERR_INVALID_COURSE_ID',
      `Invalid NPTEL course code "${id}". Expected format noc26-<dept><num> (e.g., noc26-cs01).`,
      400
    );
    return;
  }

  const courses = loadCourses();
  const found = courses.find((c: { id: string }) => c.id.toLowerCase() === id.toLowerCase());

  if (!found) {
    sendNptelError(
      res,
      'NPTEL_ERR_COURSE_NOT_FOUND',
      `Course "${id}" was not found in the Jul-Nov 2026 NPTEL catalog.`,
      404
    );
    return;
  }

  sendNptelSuccess(res, found);
});

export default router;
