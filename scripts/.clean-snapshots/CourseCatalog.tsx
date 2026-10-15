import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Languages,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import type { NptelCourse } from '../types/nptel';
import { ProgressRing } from './ProgressRing';

interface CourseCatalogProps {
  courses: NptelCourse[];
  onOpenCourse: (course: NptelCourse) => void;
}

const DISCIPLINES = [
  'All',
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Humanities & Management',
];

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses, onOpenCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState<'All' | 4 | 8 | 12>('All');
  const [onlyAicteFdp, setOnlyAicteFdp] = useState(false);

  // [DEMO HOOK #3 — ACT 4: Browser & A11y Verification]
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        course.title.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.tags.some((t) => t.toLowerCase().includes(q));

      const matchesDiscipline =
        selectedDiscipline === 'All' || course.discipline === selectedDiscipline;

      const matchesDuration =
        selectedDuration === 'All' || course.durationWeeks === selectedDuration;

      const matchesAicte = !onlyAicteFdp || course.aicteFdpApproved;

      return matchesSearch && matchesDiscipline && matchesDuration && matchesAicte;
    });
  }, [courses, searchQuery, selectedDiscipline, selectedDuration, onlyAicteFdp]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#800000] via-[#990000] to-[#1e293b] text-white p-6 md:p-8 shadow-md">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-200 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IIT MADRAS • NATIONAL MOOCs COORDINATOR</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Quality Engineering &amp; Science Education from India&apos;s Premier Institutes
          </h1>
          <p className="text-sm md:text-base text-slate-100 leading-relaxed">
            Access credit-eligible 4, 8, and 12-week certification courses taught by faculty from
            the IITs and IISc, complete with Bhashini regional language transcripts (Tamil, Hindi,
            Telugu &amp; 13+ languages) and proctored national certifications.
          </p>
        </div>

        {/* National Impact KPI Strip */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-3.5">
            <div className="text-2xl font-extrabold text-amber-300">2.84 Cr+</div>
            <div className="text-xs text-slate-200">Cumulative Learner Enrollments</div>
          </div>
          <div className="bg-black/20 rounded-xl p-3.5">
            <div className="text-2xl font-extrabold text-amber-300">3,200+</div>
            <div className="text-xs text-slate-200">Active Courses Across Disciplines</div>
          </div>
          <div className="bg-black/20 rounded-xl p-3.5">
            <div className="text-2xl font-extrabold text-amber-300">5,420+</div>
            <div className="text-xs text-slate-200">NPTEL Local Chapter Colleges</div>
          </div>
          <div className="bg-black/20 rounded-xl p-3.5">
            <div className="text-2xl font-extrabold text-amber-300">16 Languages</div>
            <div className="text-xs text-slate-200">Translated Lecture Transcripts</div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section
        aria-label="Course Catalog Filters"
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label
              htmlFor="nptel-course-search"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Search Course, Faculty, or NOC Code
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="nptel-course-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Python, Deep Learning, Prof. Madhavan, noc26-cs01..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-2 focus:outline-[#990000]"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="nptel-discipline-select"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Discipline
            </label>
            <div className="relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="nptel-discipline-select"
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-2 focus:outline-[#990000]"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Duration (Credit Tier)
            </span>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 4, 8, 12] as const).map((dur) => (
                <button
                  key={String(dur)}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  aria-pressed={selectedDuration === dur}
                  aria-label={dur === 'All' ? 'All durations' : `${dur} week courses`}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    selectedDuration === dur
                      ? 'bg-[#990000] text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dur === 'All' ? 'All' : `${dur}W`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <label className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAicteFdp}
              onChange={(e) => setOnlyAicteFdp(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span>Show only AICTE Approved FDP (Faculty Development Programme) Courses</span>
          </label>

          <div aria-live="polite" className="text-xs font-semibold text-slate-600">
            Showing <span className="text-[#990000] font-bold">{filteredCourses.length}</span> of{' '}
            {courses.length} Jul–Nov 2026 Courses
          </div>
        </div>
      </section>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-800">
            No NPTEL courses matched your current filter combination.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedDiscipline('All');
              setSelectedDuration('All');
              setOnlyAicteFdp(false);
            }}
            className="px-4 py-2 rounded-lg bg-[#990000] text-white text-sm font-semibold hover:bg-[#7a0000]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-red-50 text-[#990000] border border-red-200">
                      {course.institute}
                    </span>
                    {course.aicteFdpApproved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Award className="w-3 h-3" />
                        AICTE FDP
                      </span>
                    )}
                  </div>
                  <ProgressRing
                    value={course.completionRate}
                    label={`${course.title} average assignment completion rate`}
                    sizePx={46}
                    thicknessPx={5}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {course.instructor} • <span className="text-slate-500">{course.discipline}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {course.overview}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#990000]" />
                    <span>
                      <strong>{course.durationWeeks}W</strong> ({course.credits} Cr)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#990000]" />
                    <span>{(course.enrollments / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-[#990000]" />
                    <span>EN / TA / HI</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                    {course.examRegistrationOpen ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Exam: {course.examDate.split(' ')[0]}</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>Exam Reg. Closed</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenCourse(course)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#990000] text-white text-xs font-bold hover:bg-[#7a0000] transition-colors"
                  >
                    <span>Enter Classroom</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
