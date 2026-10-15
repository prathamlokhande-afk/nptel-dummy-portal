export type TranscriptLang = 'en' | 'ta' | 'hi';

export interface CourseWeek {
  weekNumber: number;
  title: string;
  videoTitle: string;
  durationMinutes: number;
  assignmentTitle: string;
  transcripts: Record<TranscriptLang, string>;
}

export interface NptelCourse {
  id: string;
  code: string;
  title: string;
  instructor: string;
  institute: string;
  discipline: string;
  durationWeeks: 4 | 8 | 12;
  credits: number;
  aicteFdpApproved: boolean;
  examRegistrationOpen: boolean;
  examDate: string;
  enrollments: number;
  completionRate: number;
  rating: number;
  tags: string[];
  overview: string;
  weeks: CourseWeek[];
}

export type NptelBadgeTier =
  | 'Elite + Gold'
  | 'Elite + Silver'
  | 'Elite'
  | 'Successfully Completed'
  | 'Not Qualified';

export interface GradingResult {
  durationWeeks: 4 | 8 | 12;
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
  durationWeeks: 4 | 8 | 12;
  bestNCount: number;
  assignmentScoreOut25: number;
  meetsAssignmentMinimum: boolean;
  milestones: MedalTargetMilestone[];
}

export interface NptelCertificate {
  certificateId: string;
  rollNumber: string;
  studentName: string;
  instituteName: string;
  localChapterId: string;
  courseId: string;
  courseTitle: string;
  instructor: string;
  semester: string;
  durationWeeks: number;
  credits: number;
  assignmentScoreOut25: number;
  examScoreOut75: number;
  totalScore: number;
  badgeTier: NptelBadgeTier;
  topperRank: string | null;
  issuedAt: string;
  verified: boolean;
}

export interface SpocChapter {
  chapterId: string;
  collegeName: string;
  city: string;
  state: string;
  spocName: string;
  rating: string;
  enrolledStudents: number;
  examRegistered: number;
  eliteGoldCount: number;
  eliteSilverCount: number;
  fdpCount: number;
}

export interface SpocAnalyticsData {
  summary: {
    totalLocalChapters: number;
    activeEnrollmentsSemester: number;
    examRegistrationsConfirmed: number;
    fdpFacultyEnrolled: number;
    regionalTranslationsAvailable: number;
  };
  chapters: SpocChapter[];
}
