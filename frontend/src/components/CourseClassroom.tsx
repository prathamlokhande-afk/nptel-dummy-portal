import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  FileText,
  Languages,
  PlayCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type {
  GradingResult,
  MedalSimulationResult,
  NptelCourse,
  TranscriptLang,
} from '../types/nptel';
import { ProgressRing } from './ProgressRing';

interface CourseClassroomProps {
  course: NptelCourse;
  allCourses: NptelCourse[];
  onSelectCourse: (course: NptelCourse) => void;
  onBackToCatalog: () => void;
}

const LANG_LABELS: Record<TranscriptLang, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  ta: { label: 'Tamil', native: 'தமிழ் (Bhashini)' },
  hi: { label: 'Hindi', native: 'हिन्दी (Bhashini)' },
};

function defaultAssignmentsForDuration(weeks: 4 | 8 | 12): number[] {
  if (weeks === 4) return [88, 92, 76, 84];
  if (weeks === 8) return [85, 90, 78, 92, 88, 60, 95, 80];
  return [85, 90, 78, 92, 88, 64, 95, 82, 91, 70, 86, 89];
}

export const CourseClassroom: React.FC<CourseClassroomProps> = ({
  course,
  allCourses,
  onSelectCourse,
  onBackToCatalog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lectures' | 'grading' | 'simulator'>(
    'lectures'
  );
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [transcriptLang, setTranscriptLang] = useState<TranscriptLang>('en');

  const [assignmentScores, setAssignmentScores] = useState<number[]>(() =>
    defaultAssignmentsForDuration(course.durationWeeks)
  );
  const [examScoreOut100, setExamScoreOut100] = useState<number>(84);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [simulationResult, setSimulationResult] = useState<MedalSimulationResult | null>(null);

  useEffect(() => {
    setSelectedWeekIndex(0);
    setAssignmentScores(defaultAssignmentsForDuration(course.durationWeeks));
  }, [course.id, course.durationWeeks]);

  useEffect(() => {
    let cancelled = false;
    async function runCalculations() {
      try {
        const [gradeRes, simRes] = await Promise.all([
          fetch('/api/grading/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              durationWeeks: course.durationWeeks,
              assignmentScores,
              examScoreOut100,
            }),
          }),
          fetch('/api/grading/simulate-medals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              durationWeeks: course.durationWeeks,
              assignmentScores,
            }),
          }),
        ]);

        const gradeJson = await gradeRes.json();
        const simJson = await simRes.json();
        if (!cancelled) {
          if (gradeJson.success) setGradingResult(gradeJson.data);
          if (simJson.success) setSimulationResult(simJson.data);
        }
      } catch {
        // Fallback if backend is restarting
      }
    }
    runCalculations();
    return () => {
      cancelled = true;
    };
  }, [course.durationWeeks, assignmentScores, examScoreOut100]);

  const currentWeek = course.weeks[selectedWeekIndex] ?? course.weeks[0];

  const handleAssignmentChange = (idx: number, rawVal: string) => {
    const parsed = Number(rawVal);
    const clamped = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
    setAssignmentScores((prev) => prev.map((v, i) => (i === idx ? clamped : v)));
  };

  return (
    <div className="space-y-6">
      {/* Top Course Switcher & Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#990000] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All NPTEL Courses</span>
        </button>

        <div className="flex items-center gap-2">
          <label
            htmlFor="classroom-course-switcher"
            className="text-xs font-semibold text-slate-600"
          >
            Switch Active Course:
          </label>
          <select
            id="classroom-course-switcher"
            value={course.id}
            onChange={(e) => {
              const found = allCourses.find((c) => c.id === e.target.value);
              if (found) onSelectCourse(found);
            }}
            className="text-xs font-semibold rounded-lg border border-slate-300 px-3 py-1.5 bg-slate-50"
          >
            {allCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title} ({c.durationWeeks}W)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Banner Header */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#990000] text-white">
              {course.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
              {course.institute}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
              {course.durationWeeks} Weeks • {course.credits} AICTE/UGC Credits
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{course.title}</h1>
          <p className="text-sm font-medium text-slate-600">
            Instructor: <strong className="text-slate-900">{course.instructor}</strong> • Exam Date:{' '}
            <span className="text-[#990000] font-semibold">{course.examDate}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 self-end md:self-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
          <ProgressRing
            value={gradingResult ? gradingResult.totalScoreOut100 : course.completionRate}
            label="Projected Composite Course Score"
            sizePx={58}
            thicknessPx={6}
          />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Projected Standing
            </div>
            <div className="text-sm font-extrabold text-[#990000]">
              {gradingResult ? gradingResult.badgeTier : 'Elite'}
            </div>
            <div className="text-[11px] text-slate-600">
              Best {gradingResult?.bestNCount ?? 6} of {course.durationWeeks} Assignments + Exam
            </div>
          </div>
        </div>
      </section>

      {/* Classroom Sub-Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Course Classroom Sections"
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === 'lectures'}
          onClick={() => setActiveSubTab('lectures')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            activeSubTab === 'lectures'
              ? 'bg-[#990000] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>Lectures &amp; Bhashini Transcripts</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === 'grading'}
          onClick={() => setActiveSubTab('grading')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            activeSubTab === 'grading'
              ? 'bg-[#990000] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Official 25/75 Grading Calculator</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === 'simulator'}
          onClick={() => setActiveSubTab('simulator')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            activeSubTab === 'simulator'
              ? 'bg-[#990000] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Exam Medal Target Simulator</span>
        </button>
      </div>

      {/* TAB 1: Lectures & Multilingual Bhashini Transcripts */}
      {activeSubTab === 'lectures' && currentWeek && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Syllabus Week Selector */}
          <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 space-y-3 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#990000]" />
                <span>Weekly Modules</span>
              </h2>
              <span className="text-xs text-slate-500">{course.weeks.length} Loaded</span>
            </div>

            <div className="space-y-2">
              {course.weeks.map((wk, idx) => (
                <button
                  key={wk.weekNumber}
                  type="button"
                  onClick={() => setSelectedWeekIndex(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    idx === selectedWeekIndex
                      ? 'bg-red-50/80 border-[#990000] text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#990000]">
                    <span>WEEK {wk.weekNumber}</span>
                    <span>{wk.durationMinutes} mins</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">{wk.title}</div>
                </button>
              ))}
            </div>
          </aside>

          {/* Right Video Player + Multilingual Transcript Viewer */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-slate-900 text-white rounded-xl overflow-hidden shadow-md">
              <div className="aspect-video bg-gradient-to-br from-slate-900 via-[#2a0808] to-slate-800 p-8 flex flex-col justify-between relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#990000] text-white">
                    IIT Madras Studio • Week {currentWeek.weekNumber}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    Duration: {currentWeek.durationMinutes}:00
                  </span>
                </div>

                <div className="my-auto text-center space-y-3 max-w-xl mx-auto">
                  <PlayCircle className="w-14 h-14 text-amber-400 mx-auto opacity-90" />
                  <h3 className="text-xl font-bold">{currentWeek.videoTitle}</h3>
                  <p className="text-xs text-slate-300">
                    {course.instructor} • {course.institute}
                  </p>
                </div>

                <div className="bg-black/40 backdrop-blur-xs rounded-lg p-3 border border-white/10 text-xs text-amber-100">
                  <strong>Live Caption Preview ({LANG_LABELS[transcriptLang].native}):</strong>{' '}
                  {currentWeek.transcripts[transcriptLang]}
                </div>
              </div>
            </div>

            {/* Multilingual Transcript Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-[#990000]" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Synchronized Regional Lecture Transcript (NPTEL TEXT / Bhashini)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select a regional language to inspect peer-reviewed IIT Madras translations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  {(['en', 'ta', 'hi'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setTranscriptLang(lang)}
                      aria-pressed={transcriptLang === lang}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        transcriptLang === lang
                          ? 'bg-[#990000] text-white shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {LANG_LABELS[lang].native}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {currentWeek.transcripts[transcriptLang]}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                  <FileText className="w-4 h-4 text-[#990000]" />
                  Linked Assignment: {currentWeek.assignmentTitle}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('grading')}
                  className="font-bold text-[#990000] hover:underline"
                >
                  Open Grading Calculator →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Official 25/75 Grading Calculator */}
      {activeSubTab === 'grading' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Official NPTEL Score &amp; Eligibility Calculator ({course.durationWeeks}-Week Course)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Per IIT Madras guidelines, your Assignment Score (25% weight) is computed from the{' '}
                <strong>
                  Best {gradingResult?.bestNCount ?? 6} out of {course.durationWeeks}
                </strong>{' '}
                weekly assignments. Proctored Exam carries 75% weight.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {assignmentScores.map((score, idx) => {
                const isDropped =
                  gradingResult &&
                  idx >= course.durationWeeks - (course.durationWeeks - gradingResult.bestNCount) &&
                  false; // Visual indicator handled below
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      isDropped ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <label
                      htmlFor={`week-score-${idx + 1}`}
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      Week {idx + 1} (/100)
                    </label>
                    <input
                      id={`week-score-${idx + 1}`}
                      type="number"
                      min={0}
                      max={100}
                      value={score}
                      onChange={(e) => handleAssignmentChange(idx, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-sm font-bold text-slate-900"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <label
                htmlFor="proctored-exam-score-input"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                Proctored Final Exam Score (Out of 100):{' '}
                <span className="text-[#990000]">{examScoreOut100}%</span>
              </label>
              <input
                id="proctored-exam-score-input"
                type="range"
                min={0}
                max={100}
                value={examScoreOut100}
                onChange={(e) => setExamScoreOut100(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>0%</span>
                <span className="text-amber-700 font-semibold">40% Qualifying Threshold (30/75)</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Calculation Output Card */}
          <div
            aria-live="polite"
            className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-5 flex flex-col justify-between"
          >
            {gradingResult ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Official Evaluation Result
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                        gradingResult.isQualifiedForCertificate
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {gradingResult.isQualifiedForCertificate ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {gradingResult.badgeTier}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-xs text-slate-500">
                        Best {gradingResult.bestNCount} Assign.
                      </div>
                      <div
                        className={`text-xl font-extrabold mt-0.5 ${
                          gradingResult.meetsAssignmentCriteria
                            ? 'text-slate-900'
                            : 'text-red-600'
                        }`}
                      >
                        {gradingResult.assignmentScoreOut25}
                        <span className="text-xs font-normal text-slate-500"> / 25</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Min 10.0 req</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Proctored Exam</div>
                      <div
                        className={`text-xl font-extrabold mt-0.5 ${
                          gradingResult.meetsExamCriteria ? 'text-slate-900' : 'text-red-600'
                        }`}
                      >
                        {gradingResult.examScoreOut75}
                        <span className="text-xs font-normal text-slate-500"> / 75</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Min 30.0 req</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Final Composite</div>
                      <div className="text-2xl font-extrabold text-[#990000] mt-0.5">
                        {gradingResult.totalScoreOut100}
                        <span className="text-xs font-normal text-slate-500"> / 100</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Rounded</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-slate-800 leading-relaxed">
                    {gradingResult.explanation}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Top {gradingResult.bestNCount} counted:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    [{gradingResult.selectedBestAssignments.join(', ')}]
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Calculating NPTEL score…</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NPTEL Exam Score & Medal Target Simulator */}
      {activeSubTab === 'simulator' && simulationResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#990000] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Exam Target Planner</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                NPTEL Certification &amp; Medal Target Simulator
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Based on your current Best {simulationResult.bestNCount} of {course.durationWeeks}{' '}
                Assignment Score of{' '}
                <strong className="text-[#990000]">
                  {simulationResult.assignmentScoreOut25} / 25
                </strong>
                , here is the exact Proctored Exam score required for each NPTEL certificate tier:
              </p>
            </div>

            <div
              className={`px-3.5 py-2 rounded-lg text-xs font-bold border ${
                simulationResult.meetsAssignmentMinimum
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-red-50 text-red-900 border-red-200'
              }`}
            >
              Assignment Score: {simulationResult.assignmentScoreOut25} / 25.0 (
              {simulationResult.meetsAssignmentMinimum
                ? 'Eligible >= 10/25'
                : 'Below 10/25 Minimum'}
              )
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {simulationResult.milestones.map((m) => (
              <div
                key={m.tier}
                className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 ${
                  m.achievable
                    ? 'border-slate-200 bg-slate-50/70'
                    : 'border-red-200 bg-red-50/40 opacity-80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#990000]">
                      Target &ge; {m.targetTotalScore}%
                    </span>
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{m.tier}</h3>
                </div>

                <div className="my-2">
                  <div className="text-2xl font-extrabold text-slate-900">
                    {m.requiredExamScoreOut75}
                    <span className="text-xs font-normal text-slate-500"> / 75</span>
                  </div>
                  <div className="text-xs font-semibold text-[#990000]">
                    ({m.requiredExamScoreOut100}% in Proctored Exam)
                  </div>
                </div>

                <p className="text-xs text-slate-600 border-t border-slate-200/80 pt-2">
                  {m.statusNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
