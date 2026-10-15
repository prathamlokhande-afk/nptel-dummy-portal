import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateNptelGrade,
  getBestAssignmentCount,
  simulateMedalTargets,
} from '../src/services/gradingService.js';

describe('NPTEL Official Grading Engine (IIT Madras Standards)', () => {
  it('selects Best 3 of 4, Best 6 of 8, and Best 8 of 12 weekly assignments', () => {
    assert.equal(getBestAssignmentCount(4), 3);
    assert.equal(getBestAssignmentCount(8), 6);
    assert.equal(getBestAssignmentCount(12), 8);
  });

  it('awards Elite + Gold when Best 6 of 8 assignments + Exam >= 90 and both minimums are met', () => {
    const result = calculateNptelGrade({
      durationWeeks: 8,
      // Lowest 2 scores (40, 50) should be dropped; top 6 are all 96
      assignmentScores: [96, 96, 40, 96, 96, 50, 96, 96],
      examScoreOut100: 92, // 69 / 75
    });

    assert.equal(result.bestNCount, 6);
    assert.equal(result.assignmentAverageOut100, 96);
    assert.equal(result.assignmentScoreOut25, 24);
    assert.equal(result.examScoreOut75, 69);
    assert.equal(result.totalScoreOut100, 93);
    assert.equal(result.isQualifiedForCertificate, true);
    assert.equal(result.badgeTier, 'Elite + Gold');
  });

  it('disqualifies a learner who scores high in the exam (70/75) but below 10/25 in assignments', () => {
    const result = calculateNptelGrade({
      durationWeeks: 8,
      assignmentScores: [30, 35, 30, 25, 30, 35, 10, 0], // Best 6 avg = 32.5 -> 8.13 / 25 (< 10)
      examScoreOut100: 94, // 70.5 / 75
    });

    assert.equal(result.meetsAssignmentCriteria, false);
    assert.equal(result.meetsExamCriteria, true);
    assert.equal(result.isQualifiedForCertificate, false);
    assert.equal(result.badgeTier, 'Not Qualified');
  });

  it('simulates required proctored exam scores for Pass, Elite, Silver, and Gold milestones', () => {
    const sim = simulateMedalTargets(8, [85, 90, 78, 92, 88, 60, 95, 80]);
    assert.equal(sim.meetsAssignmentMinimum, true);
    assert.equal(sim.milestones.length, 4);
    const goldMilestone = sim.milestones.find((m) => m.tier === 'Elite + Gold');
    assert.ok(goldMilestone);
    assert.equal(goldMilestone.achievable, true);
  });
});
