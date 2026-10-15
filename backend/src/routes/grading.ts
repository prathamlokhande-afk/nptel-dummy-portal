import { Router } from 'express';
import {
  calculateNptelGrade,
  simulateMedalTargets,
  type CourseDurationWeeks,
} from '../services/gradingService.js';
import { sendNptelError, sendNptelSuccess } from '../utils/apiResponse.js';

const router = Router();
const VALID_DURATIONS = new Set<number>([4, 8, 12]);

/**
 * POST /api/grading/calculate
 * Body: { durationWeeks: 4 | 8 | 12, assignmentScores: number[], examScoreOut100: number }
 */
router.post('/calculate', (req, res) => {
  const { durationWeeks, assignmentScores, examScoreOut100 } = req.body ?? {};

  if (!VALID_DURATIONS.has(Number(durationWeeks))) {
    sendNptelError(
      res,
      'NPTEL_ERR_INVALID_DURATION',
      'durationWeeks must be strictly 4, 8, or 12 according to NPTEL guidelines.',
      400
    );
    return;
  }

  if (
    !Array.isArray(assignmentScores) ||
    assignmentScores.length === 0 ||
    !assignmentScores.every(
      (s) => typeof s === 'number' && Number.isFinite(s) && s >= 0 && s <= 100
    )
  ) {
    sendNptelError(
      res,
      'NPTEL_ERR_INVALID_ASSIGNMENTS',
      'assignmentScores must be a non-empty array of numeric scores (0-100).',
      400
    );
    return;
  }

  const numExam = Number(examScoreOut100);
  if (!Number.isFinite(numExam) || numExam < 0 || numExam > 100) {
    sendNptelError(
      res,
      'NPTEL_ERR_INVALID_EXAM_SCORE',
      'examScoreOut100 must be a valid number between 0 and 100.',
      400
    );
    return;
  }

  const validDuration = Number(durationWeeks) as CourseDurationWeeks;
  const numericAssignments = assignmentScores.map(Number);

  const result = calculateNptelGrade({
    durationWeeks: validDuration,
    assignmentScores: numericAssignments,
    examScoreOut100: numExam,
  });

  const simulation = simulateMedalTargets(validDuration, numericAssignments);

  sendNptelSuccess(res, {
    ...result,
    simulatorTargets: simulation.milestones,
  });
});

/**
 * POST /api/grading/simulate-medals
 * Body: { durationWeeks: 4 | 8 | 12, assignmentScores: number[] }
 */
router.post('/simulate-medals', (req, res) => {
  const { durationWeeks, assignmentScores } = req.body ?? {};

  if (!VALID_DURATIONS.has(Number(durationWeeks))) {
    sendNptelError(
      res,
      'NPTEL_ERR_INVALID_DURATION',
      'durationWeeks must be strictly 4, 8, or 12.',
      400
    );
    return;
  }

  if (!Array.isArray(assignmentScores) || assignmentScores.length === 0) {
    sendNptelError(
      res,
      'NPTEL_ERR_INVALID_ASSIGNMENTS',
      'assignmentScores must be a non-empty array of numeric scores (0-100).',
      400
    );
    return;
  }

  const simulation = simulateMedalTargets(
    Number(durationWeeks) as CourseDurationWeeks,
    assignmentScores.map(Number)
  );

  sendNptelSuccess(res, simulation);
});

export default router;
