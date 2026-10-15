export type CourseDurationWeeks = 4 | 8 | 12;

export type NptelBadgeTier =
  | 'Elite + Gold'
  | 'Elite + Silver'
  | 'Elite'
  | 'Successfully Completed'
  | 'Not Qualified';

export interface GradingInput {
  durationWeeks: CourseDurationWeeks;
  assignmentScores: number[]; // Array of scores out of 100
  examScoreOut100: number; // Proctored exam score out of 100
}

export interface GradingResult {
  durationWeeks: CourseDurationWeeks;
  bestNCount: number;
  selectedBestAssignments: number[];
  assignmentAverageOut100: number;
  assignmentScoreOut25: number;
  examScoreOut75: number;
  totalScoreOut100: number;
  meetsAssignmentCriteria: boolean;
  meetsExamCriteria: boolean;
  isQualifiedForCertificate: boolean;
  badgeTier: NptelBadgeTier;
  explanation: string;
}

export interface MedalTargetMilestone {
  tier: Exclude<NptelBadgeTier, 'Not Qualified'>;
  targetTotalScore: number;
  requiredExamScoreOut75: number;
  requiredExamScoreOut100: number;
  achievable: boolean;
  statusNote: string;
}

export interface MedalSimulationResult {
  durationWeeks: CourseDurationWeeks;
  bestNCount: number;
  assignmentScoreOut25: number;
  meetsAssignmentMinimum: boolean;
  milestones: MedalTargetMilestone[];
}

/**
 * Returns how many "Best N" weekly assignments are counted for a given NPTEL course duration.
 * - 4-week course -> Best 3 of 4
 * - 8-week course -> Best 6 of 8
 * - 12-week course -> Best 8 of 12
 */
export function getBestAssignmentCount(durationWeeks: CourseDurationWeeks): number {
  switch (durationWeeks) {
    case 4:
      return 3;
    case 8:
      return 6;
    case 12:
      return 8;
    default:
      throw new Error(`Unsupported NPTEL course duration: ${durationWeeks}`);
  }
}

/**
 * [DEMO HOOK #1 — ACT 1: Antigravity Tab / Cmd+I Inline Refactor / Code Lens Write Tests]
 * Calculates the official IIT Madras NPTEL final score and certificate badge tier.
 */
export function calculateNptelGrade(input: GradingInput): GradingResult {
  const { durationWeeks, assignmentScores, examScoreOut100 } = input;
  const bestNCount = getBestAssignmentCount(durationWeeks);

  const sanitizedScores = assignmentScores.map((s) =>
    Number.isFinite(s) ? Math.max(0, Math.min(100, s)) : 0
  );
  const clampedExam100 = Number.isFinite(examScoreOut100)
    ? Math.max(0, Math.min(100, examScoreOut100))
    : 0;

  // Sort descending and pick top bestNCount assignments (pad with 0s if fewer submitted)
  const padded = [...sanitizedScores];
  while (padded.length < bestNCount) {
    padded.push(0);
  }
  const sortedDesc = padded.sort((a, b) => b - a);
  const selectedBestAssignments = sortedDesc.slice(0, bestNCount);

  const sumBest = selectedBestAssignments.reduce((acc, val) => acc + val, 0);
  const assignmentAverageOut100 = Number((sumBest / bestNCount).toFixed(2));
  const assignmentScoreOut25 = Number(((assignmentAverageOut100 * 25) / 100).toFixed(2));
  const examScoreOut75 = Number(((clampedExam100 * 75) / 100).toFixed(2));

  // Official NPTEL Dual Qualifying Thresholds:
  // 1) Assignment score >= 10 / 25 (40% of 25)
  // 2) Proctored Exam score >= 30 / 75 (40% of 75)
  const meetsAssignmentCriteria = assignmentScoreOut25 >= 10;
  const meetsExamCriteria = examScoreOut75 >= 30;
  const isQualifiedForCertificate = meetsAssignmentCriteria && meetsExamCriteria;

  const totalScoreOut100 = Math.round(assignmentScoreOut25 + examScoreOut75);

  let badgeTier: NptelBadgeTier = 'Not Qualified';
  if (isQualifiedForCertificate) {
    if (totalScoreOut100 >= 90) {
      badgeTier = 'Elite + Gold';
    } else if (totalScoreOut100 >= 75) {
      badgeTier = 'Elite + Silver';
    } else if (totalScoreOut100 >= 60) {
      badgeTier = 'Elite';
    } else if (totalScoreOut100 >= 40) {
      badgeTier = 'Successfully Completed';
    }
  }

  let explanation = '';
  if (!meetsAssignmentCriteria && !meetsExamCriteria) {
    explanation = `Did not meet either qualifying threshold: Assignment score is ${assignmentScoreOut25}/25 (needs >= 10/25) and Exam score is ${examScoreOut75}/75 (needs >= 30/75).`;
  } else if (!meetsAssignmentCriteria) {
    explanation = `Ineligible for certificate despite ${examScoreOut75}/75 exam score: Best ${bestNCount} assignment score is ${assignmentScoreOut25}/25 (minimum 10/25 required).`;
  } else if (!meetsExamCriteria) {
    explanation = `Ineligible for certificate despite ${assignmentScoreOut25}/25 assignment score: Proctored exam score is ${examScoreOut75}/75 (minimum 30/75 required).`;
  } else {
    explanation = `Qualified for "${badgeTier}" Certificate! Best ${bestNCount} assignments contributed ${assignmentScoreOut25}/25 and Proctored Exam contributed ${examScoreOut75}/75 for a rounded total of ${totalScoreOut100}/100.`;
  }

  return {
    durationWeeks,
    bestNCount,
    selectedBestAssignments,
    assignmentAverageOut100,
    assignmentScoreOut25,
    examScoreOut75,
    totalScoreOut100,
    meetsAssignmentCriteria,
    meetsExamCriteria,
    isQualifiedForCertificate,
    badgeTier,
    explanation,
  };
}

/**
 * [DEMO HOOK #2 — ACT 2: Spec-to-Full-Stack Feature (/plan + Wireframe Image)]
 * Simulates the required Proctored Exam score (out of 75 and out of 100) needed
 * to achieve each NPTEL certificate tier given a learner's weekly assignment scores.
 */
export function simulateMedalTargets(
  durationWeeks: CourseDurationWeeks,
  assignmentScores: number[]
): MedalSimulationResult {
  const preview = calculateNptelGrade({
    durationWeeks,
    assignmentScores,
    examScoreOut100: 0,
  });

  const { bestNCount, assignmentScoreOut25, meetsAssignmentCriteria } = preview;

  const tiers: Array<{
    tier: Exclude<NptelBadgeTier, 'Not Qualified'>;
    targetTotalScore: number;
  }> = [
    { tier: 'Successfully Completed', targetTotalScore: 40 },
    { tier: 'Elite', targetTotalScore: 60 },
    { tier: 'Elite + Silver', targetTotalScore: 75 },
    { tier: 'Elite + Gold', targetTotalScore: 90 },
  ];

  const milestones: MedalTargetMilestone[] = tiers.map(({ tier, targetTotalScore }) => {
    // Because totalScoreOut100 = Math.round(assignmentScoreOut25 + examScoreOut75),
    // and examScoreOut75 must also be at least 30.0 to qualify:
    const rawNeededOut75 = Math.max(30, targetTotalScore - 0.5 - assignmentScoreOut25);
    const requiredExamScoreOut75 = Number(Math.max(30, rawNeededOut75).toFixed(1));
    const requiredExamScoreOut100 = Number(
      Math.min(100, Math.ceil((requiredExamScoreOut75 / 75) * 100))
    );
    const achievable = meetsAssignmentCriteria && requiredExamScoreOut75 <= 75;

    let statusNote = '';
    if (!meetsAssignmentCriteria) {
      statusNote = 'Blocked: Assignment score is below 10/25 minimum threshold.';
    } else if (!achievable) {
      statusNote = `Unreachable: Would require ${requiredExamScoreOut75}/75 (> 75 max) in final exam.`;
    } else {
      statusNote = `Need ${requiredExamScoreOut75}/75 (${requiredExamScoreOut100}%) in the Proctored Exam.`;
    }

    return {
      tier,
      targetTotalScore,
      requiredExamScoreOut75,
      requiredExamScoreOut100,
      achievable,
      statusNote,
    };
  });

  return {
    durationWeeks,
    bestNCount,
    assignmentScoreOut25,
    meetsAssignmentMinimum: meetsAssignmentCriteria,
    milestones,
  };
}
