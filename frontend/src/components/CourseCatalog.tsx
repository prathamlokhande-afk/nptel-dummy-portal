import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Languages,
  Quote,
  Search,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import type { NptelCourse } from '../types/nptel';
import type { ActivePortalTab } from './Header';
import { NptelOfficialLogo } from './Header';
import { ProgressRing } from './ProgressRing';

interface CourseCatalogProps {
  courses: NptelCourse[];
  onOpenCourse: (course: NptelCourse) => void;
  onNavigateTab?: (tab: ActivePortalTab) => void;
}

const DISCIPLINES = [
  'All',
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Humanities & Management',
];

const COORDINATOR_INSTITUTES = [
  { short: 'IITB', name: 'IIT Bombay', city: 'Mumbai', color: '#1e3a8a' },
  { short: 'IITD', name: 'IIT Delhi', city: 'New Delhi', color: '#991b1b' },
  { short: 'IITK', name: 'IIT Kanpur', city: 'Kanpur', color: '#b45309' },
  { short: 'IITKGP', name: 'IIT Kharagpur', city: 'Kharagpur', color: '#1e40af' },
  { short: 'IITG', name: 'IIT Guwahati', city: 'Guwahati', color: '#065f46' },
  { short: 'IITR', name: 'IIT Roorkee', city: 'Roorkee', color: '#3730a3' },
  { short: 'IITM', name: 'IIT Madras', city: 'Chennai', color: '#7b1f23' },
  { short: 'IISc', name: 'IISc Bangalore', city: 'Bengaluru', color: '#0f172a' },
];

type NewsTabKey = 'jul2026' | 'jan2027' | 'general' | 'events';

const NEWS_BY_TAB: Record<
  NewsTabKey,
  Array<{ title: string; badge?: string; actionTab?: ActivePortalTab }>
> = {
  jul2026: [
    {
      title: 'Timelines and Guidelines for Jul–Dec 2026 Semester',
      badge: 'Updated',
    },
    {
      title: 'List of courses (Jul–Nov 2026 IIT & IISc Certification Catalog)',
      badge: '6 Featured',
    },
    {
      title: 'Certain July 2026 semester courses are open for exam registration now!',
      badge: 'Exam Reg',
    },
    {
      title: 'Problem Solving Live Session by PMRF Scholars - Jul 2026',
      actionTab: 'classroom',
    },
    {
      title: 'Results & QR e-Certificate Verification for Recent Exams',
      actionTab: 'certificates',
    },
    {
      title: 'October 2026 Proctored Exam Hallticket Status',
      actionTab: 'certificates',
    },
  ],
  jan2027: [
    { title: 'Tentative Course List for Jan–Apr 2027 Semester across 7 IITs & IISc' },
    { title: 'AICTE FDP Approval Circular for Jan–Apr 2027 Faculty Enrollments' },
    { title: 'SWAYAM Local Chapter SPOC Nomination Window — Jan 2027' },
  ],
  general: [
    {
      title: 'NPTEL Bhashini Regional Language Transcripts Available in 16 Indian Languages',
      actionTab: 'classroom',
    },
    {
      title: 'Official 25/75 Best-N Assignment & Proctored Exam Qualifying Guidelines',
      actionTab: 'classroom',
    },
    {
      title: 'Credit Transfer Framework under UGC & AICTE SWAYAM Regulations',
    },
  ],
  events: [
    {
      title: 'NPTEL STARS & Top Performing Local Chapter Felicitation at IIT Madras',
      actionTab: 'spoc',
    },
    {
      title: 'Lab Workshops & Hands-on Internship Drive for Elite + Gold Toppers',
    },
    {
      title: 'GATE Preparation Live Mentoring Series by IIT Research Scholars',
    },
  ],
};

const OFFICIAL_INITIATIVES = [
  { label: 'Credit Transfer', sub: 'UGC / AICTE', tab: 'catalog' as ActivePortalTab },
  {
    label: 'MoU with AICTE for NPTEL Course as FDP',
    sub: 'Faculty Dev',
    tab: 'catalog' as ActivePortalTab,
  },
  { label: 'Support for SPOCs', sub: 'Local Chapters', tab: 'spoc' as ActivePortalTab },
  { label: 'GATE Exams', sub: 'Prep Portal', tab: 'classroom' as ActivePortalTab },
  { label: 'NPTEL+', sub: 'Short Courses', tab: 'catalog' as ActivePortalTab },
  {
    label: 'Internship for Toppers',
    sub: 'IIT/IISc Labs',
    tab: 'certificates' as ActivePortalTab,
  },
  { label: 'Industry Associates', sub: '100+ Partners', tab: 'spoc' as ActivePortalTab },
  { label: 'Soft Skill Trainings', sub: 'Employability', tab: 'spoc' as ActivePortalTab },
  { label: 'CSR', sub: 'Fee Waiver Support', tab: 'spoc' as ActivePortalTab },
  {
    label: 'Translation',
    sub: 'Bhashini EN/TA/HI',
    tab: 'classroom' as ActivePortalTab,
  },
  { label: 'NPTEL Social Media', sub: '5.62M+ YouTube', tab: 'catalog' as ActivePortalTab },
  { label: 'Lab Workshops', sub: 'In-Person IITs', tab: 'classroom' as ActivePortalTab },
];

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  onOpenCourse,
  onNavigateTab,
}) => {
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeNewsTab, setActiveNewsTab] = useState<NewsTabKey>('jul2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedInstitute, setSelectedInstitute] = useState('All');
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
        course.institute.toLowerCase().includes(q) ||
        course.tags.some((t) => t.toLowerCase().includes(q));

      const matchesDiscipline =
        selectedDiscipline === 'All' || course.discipline === selectedDiscipline;

      const matchesInstitute =
        selectedInstitute === 'All' || course.institute === selectedInstitute;

      const matchesDuration =
        selectedDuration === 'All' || course.durationWeeks === selectedDuration;

      const matchesAicte = !onlyAicteFdp || course.aicteFdpApproved;

      return (
        matchesSearch &&
        matchesDiscipline &&
        matchesInstitute &&
        matchesDuration &&
        matchesAicte
      );
    });
  }, [
    courses,
    searchQuery,
    selectedDiscipline,
    selectedInstitute,
    selectedDuration,
    onlyAicteFdp,
  ]);

  const scrollToCatalog = () => {
    const el = document.getElementById('nptel-course-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Official https://nptel.ac.in/ Hero Banner Carousel */}
      <section
        aria-label="NPTEL Featured Announcements Carousel"
        className="relative overflow-hidden rounded-2xl bg-[#14141f] text-white shadow-lg border border-slate-800"
      >
        {/* Background visual pattern matching nptel.ac.in dark banner */}
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background:
              heroSlide === 0
                ? 'linear-gradient(115deg, #1b1b29 0%, #2a1829 48%, #4a1525 100%)'
                : heroSlide === 1
                  ? 'linear-gradient(115deg, #1e293b 0%, #0f172a 55%, #3b071e 100%)'
                  : 'linear-gradient(115deg, #18181b 0%, #450a0a 55%, #1e1b4b 100%)',
          }}
        />

        <div className="relative z-10 p-6 md:p-10 min-h-[340px] flex flex-col justify-between">
          {/* Top-left NPTEL Emblem inside Hero Slide (exact nptel.ac.in placement) */}
          <div className="flex items-center justify-between gap-4">
            <NptelOfficialLogo darkText size="sm" />
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/15">
              Jul–Nov 2026 Semester • IIT Madras
            </span>
          </div>

          {/* Center Slide Content */}
          <div className="my-6 max-w-4xl mx-auto text-center space-y-4">
            {heroSlide === 0 && (
              <>
                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
                  NPTEL celebrates{' '}
                  <span className="text-[#ffb800] underline decoration-[#ffb800]/50">
                    34+ Lakh Enrollments
                  </span>{' '}
                  in July 2026 Semester!
                </h1>
                <p className="text-base md:text-xl font-medium text-slate-200">
                  Empowering learners across India through credit-eligible IIT &amp; IISc online
                  certification courses, Bhashini multilingual transcripts, and proctored national
                  exams.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={scrollToCatalog}
                    className="px-5 py-2.5 rounded-xl bg-[#ffb800] text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
                  >
                    Explore Jul–Nov 2026 Courses
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateTab ? onNavigateTab('classroom') : onOpenCourse(courses[0]!)
                    }
                    className="px-5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-sm border border-white/25 hover:bg-white/25 transition-colors"
                  >
                    Open 25/75 Grading Simulator
                  </button>
                </div>
              </>
            )}

            {heroSlide === 1 && (
              <>
                <div className="inline-block bg-slate-900/90 border border-slate-700 rounded-2xl px-6 py-4 shadow-md">
                  <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
                    A Stronger Academic Community:{' '}
                    <span className="text-[#ffb800]">8,000+ NPTEL Local Chapters!</span>
                  </h1>
                </div>
                <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto">
                  Partnering with engineering, science, and management colleges nationwide through
                  Single Point of Contact (SPOC) faculty coordinators and CSR exam fee waivers.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.('spoc')}
                    className="px-5 py-2.5 rounded-xl bg-[#ffb800] text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
                  >
                    View Local Chapters (SPOC) Analytics
                  </button>
                </div>
              </>
            )}

            {heroSlide === 2 && (
              <>
                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
                  Bhashini Multilingual Lectures &amp;{' '}
                  <span className="text-[#ffb800]">QR-Verified e-Certificates</span>
                </h1>
                <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto">
                  Switch seamlessly between English, Tamil (தமிழ்), and Hindi (हिन्दी) lecture
                  transcripts and verify official Elite + Gold / Silver certificates.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateTab ? onNavigateTab('classroom') : onOpenCourse(courses[0]!)
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#ffb800] text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
                  >
                    Try Bhashini Lecture Classroom
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.('certificates')}
                    className="px-5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-sm border border-white/25 hover:bg-white/25 transition-colors"
                  >
                    Verify e-Certificate
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Left / Right Circular Carousel Controls + Bottom Indicator Dots */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setHeroSlide((prev) => (prev === 0 ? 2 : prev - 1))}
              aria-label="Previous banner slide"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Banner slides">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={heroSlide === idx}
                  aria-label={`Show banner slide ${idx + 1}`}
                  onClick={() => setHeroSlide(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    heroSlide === idx ? 'w-7 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setHeroSlide((prev) => (prev === 2 ? 0 : prev + 1))}
              aria-label="Next banner slide"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Official https://nptel.ac.in/ 4 Soft-Pink Impact Stat Cards (.PageCards) */}
      <section aria-label="NPTEL National Impact Statistics" className="max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: 'rgba(228, 108, 146, 0.23)',
              borderRadius: '15px',
              padding: '28px 24px',
            }}
            className="flex flex-col justify-between text-black min-h-[220px]"
          >
            <div className="text-[18px] leading-[27px]">
              <p className="font-bold">1.86 Billion+ Views,</p>
              <p className="font-bold">5.62 Million+ YouTube</p>
              <p className="font-normal">subscribers</p>
            </div>
            <div className="pt-5">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="px-5 py-3 rounded-[15px] border border-black/50 text-black text-[15px] font-semibold hover:bg-[#be123c] hover:text-white hover:border-[#be123c] transition-colors"
              >
                Explore now
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: 'rgba(228, 108, 146, 0.23)',
              borderRadius: '15px',
              padding: '28px 24px',
            }}
            className="flex flex-col justify-between text-black min-h-[220px]"
          >
            <div className="text-[18px] leading-[27px]">
              <p className="font-bold">3200+ unique courses</p>
              <p className="font-normal">available for self study.</p>
            </div>
            <div className="pt-5">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="px-5 py-3 rounded-[15px] border border-black/50 text-black text-[15px] font-semibold hover:bg-[#be123c] hover:text-white hover:border-[#be123c] transition-colors"
              >
                Explore now
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: 'rgba(228, 108, 146, 0.23)',
              borderRadius: '15px',
              padding: '28px 24px',
            }}
            className="flex flex-col justify-between text-black min-h-[220px]"
          >
            <div className="text-[18px] leading-[27px]">
              <p>
                <strong className="font-bold">3.79 crore+</strong> enrollments
              </p>
              <p>
                <strong className="font-bold">75.6 lakhs+</strong> exam
              </p>
              <p>registrations</p>
            </div>
            <div className="pt-5">
              <button
                type="button"
                onClick={() =>
                  onNavigateTab ? onNavigateTab('classroom') : onOpenCourse(courses[0]!)
                }
                className="px-5 py-3 rounded-[15px] border border-black/50 text-black text-[15px] font-semibold hover:bg-[#be123c] hover:text-white hover:border-[#be123c] transition-colors"
              >
                Explore now
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div
            style={{
              backgroundColor: 'rgba(228, 108, 146, 0.23)',
              borderRadius: '15px',
              padding: '28px 24px',
            }}
            className="flex flex-col justify-between text-black min-h-[220px]"
          >
            <div className="text-[18px] leading-[27px]">
              <p>
                <strong className="font-bold">7900+ LC colleges</strong>
              </p>
              <p>
                <strong className="font-bold">9313 MOOCs completed</strong>
              </p>
              <p>
                <strong className="font-bold">100+ Industry associates</strong>
              </p>
            </div>
            <div className="pt-5">
              <button
                type="button"
                onClick={() => (onNavigateTab ? onNavigateTab('spoc') : scrollToCatalog())}
                className="px-5 py-3 rounded-[15px] border border-black/50 text-black text-[15px] font-semibold hover:bg-[#be123c] hover:text-white hover:border-[#be123c] transition-colors"
              >
                Explore now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Official Coordinator Institutes Strip (Online Learning Initiatives by IITs and IISc) */}
      <section
        id="nptel-coordinators"
        aria-label="Partner IITs and IISc Coordinator Institutes"
        className="text-center space-y-6 py-2"
      >
        <div>
          <h2 className="text-[24px] md:text-[26px] font-semibold text-black">
            Online Learning Initiatives by IITs and IISc
          </h2>
          <p className="text-[15px] text-[#8c8c8c] mt-0.5">funded by MoE, Govt. of India</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-[1100px] mx-auto">
          {COORDINATOR_INSTITUTES.map((inst) => {
            const isSelected = selectedInstitute === inst.name;
            return (
              <button
                key={inst.name}
                type="button"
                onClick={() => {
                  setSelectedInstitute((prev) => (prev === inst.name ? 'All' : inst.name));
                  scrollToCatalog();
                }}
                aria-pressed={isSelected}
                aria-label={`Filter courses by ${inst.name}`}
                className={`group flex flex-col items-center p-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-red-50 ring-2 ring-[#7b1f23] shadow-xs'
                    : 'hover:bg-white hover:shadow-xs'
                }`}
              >
                <div
                  style={{ borderColor: inst.color }}
                  className="w-16 h-16 rounded-full bg-white border-2 flex flex-col items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
                >
                  <span
                    style={{ color: inst.color }}
                    className="text-xs font-extrabold tracking-tight"
                  >
                    {inst.short}
                  </span>
                  <span className="text-[9px] font-medium text-slate-500">{inst.city}</span>
                </div>
                <span className="mt-2 text-xs font-semibold text-slate-800">{inst.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Official https://nptel.ac.in/ News & Announcements Section (.news-section) */}
      <section
        id="nptel-news"
        aria-label="News and Announcements"
        className="max-w-[1140px] mx-auto space-y-5"
      >
        <h2 className="text-[24px] font-semibold text-black">News &amp; Announcements</h2>

        {/* 4 Tabs with exact #1c93ed active bottom border & #d3d3d3 inactive bottom border */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          role="tablist"
          aria-label="Announcement categories"
        >
          {(
            [
              { key: 'jul2026', label: 'Jul-Dec 2026 semester' },
              { key: 'jan2027', label: 'Jan-Apr 2027 semester' },
              { key: 'general', label: 'General' },
              { key: 'events', label: 'Events' },
            ] as const
          ).map((tab) => {
            const active = activeNewsTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveNewsTab(tab.key)}
                style={{
                  borderBottom: active ? '6px solid #1c93ed' : '6px solid #d3d3d3',
                  color: active ? '#1c93ed' : '#000000',
                }}
                className="text-left pb-2.5 pt-1 px-1 text-[16px] md:text-[18px] font-medium transition-colors"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3-Column Grid of #e0e0e0 Cards with 5px solid #1c93ed Left Border */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {NEWS_BY_TAB[activeNewsTab].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => {
                if (item.actionTab && onNavigateTab) {
                  onNavigateTab(item.actionTab);
                } else {
                  scrollToCatalog();
                }
              }}
              style={{
                backgroundColor: '#e0e0e0',
                borderLeft: '5px solid #1c93ed',
                borderRadius: '5px',
                padding: '14px 16px',
              }}
              className="text-left text-[15px] text-black font-normal hover:bg-[#d5d5d5] transition-colors flex items-center justify-between gap-3"
            >
              <span>{item.title}</span>
              {item.badge && (
                <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded bg-[#1c93ed] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Interactive Jul–Nov 2026 Course Catalog (#nptel-course-catalog) */}
      <div id="nptel-course-catalog" className="space-y-6 pt-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7b1f23]">
              SWAYAM – NPTEL National Course Catalog
            </span>
            <h2 className="text-2xl font-bold text-black mt-0.5">
              Jul–Nov 2026 Certification Courses (IITs &amp; IISc)
            </h2>
          </div>
          {selectedInstitute !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedInstitute('All')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-[#7b1f23] border border-red-200 hover:bg-red-100"
            >
              Filtered by {selectedInstitute} ✕
            </button>
          )}
        </div>

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
                setSelectedInstitute('All');
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
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {course.instructor} •{' '}
                      <span className="text-slate-500">{course.discipline}</span>
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

      {/* 6. Official https://nptel.ac.in/ Feedback from Learners / Testimonials Section (#e3fff1 Mint Green) */}
      <section
        id="nptel-testimonials"
        aria-label="Feedback from Learners and Testimonials"
        style={{ backgroundColor: '#e3fff1' }}
        className="rounded-2xl p-6 md:p-10 space-y-6"
      >
        <div className="space-y-1">
          <p className="text-[20px] md:text-[22px] font-medium text-black">
            Feedback from Learners
          </p>
          <h2 className="text-[26px] md:text-[28px] font-bold text-black text-center">
            Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr C P LOHITH',
              role: 'Faculty Member & NPTEL Learner',
              quote:
                'This course is a complete guide on Innovation and Entrepreneurship from basic to advance. Kudos to Professor C Bhaktavatsala Rao of IIT Madras for structured case studies.',
              date: '15 Oct 2026',
              category: 'Management',
            },
            {
              name: 'Risma A',
              role: 'B.E. Computer Science Student',
              quote:
                'Switching between English and Tamil (Bhashini) lecture transcripts in Python for Data Science helped me grasp every statistical concept and earn an Elite + Silver medal!',
              date: '15 Oct 2026',
              category: 'Computer Science',
            },
            {
              name: 'KARTIK',
              role: 'NPTEL STARS Scholar',
              quote:
                'The weekly Best-N assignment structure and clear 25/75 grading criteria kept me consistent across all 12 weeks of Deep Learning for Computer Vision.',
              date: '15 Oct 2026',
              category: 'Engineering',
            },
          ].map((t) => (
            <article
              key={t.name}
              className="bg-white rounded-xl p-6 shadow-xs border border-emerald-100 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-amber-100 text-[#7b1f23] font-extrabold flex items-center justify-center text-sm border border-amber-300">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">{t.name}</h3>
                      <p className="text-[11px] text-slate-500">{t.role}</p>
                    </div>
                  </div>
                  <Quote className="w-6 h-6 text-[#1c93ed]/40" />
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="px-2.5 py-0.5 rounded bg-amber-300/80 text-slate-900 font-semibold">
                  As shared on in LinkedIn
                </span>
                <span className="text-[#c8103b] font-semibold">
                  {t.date} | {t.category}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={scrollToCatalog}
            style={{
              backgroundColor: '#c8103b',
              borderRadius: '10px',
              border: '3px solid #ffffff',
              padding: '10px 24px',
            }}
            className="text-white text-xs font-bold tracking-wider uppercase shadow-sm hover:opacity-95 transition-opacity"
          >
            VIEW MORE POSTS
          </button>
        </div>
      </section>

      {/* 7. Official https://nptel.ac.in/ Initiatives Split Banner ("Learn with us without limits") */}
      <section
        id="nptel-initiatives"
        aria-label="NPTEL National Initiatives"
        className="rounded-2xl overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Dark Callout Column */}
        <div className="lg:col-span-4 bg-[#18181b] text-white p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <NptelOfficialLogo darkText />
            <h2 className="text-2xl md:text-3xl font-bold leading-snug text-white">
              Learn with us
              <br />
              without limits
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore NPTEL&apos;s national academic ecosystems—from UGC Credit Transfer and AICTE
              Faculty Development Programmes to Bhashini regional translation and Topper
              Internships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToCatalog}
              className="px-4 py-2 rounded-md bg-[#ffd000] text-black text-xs font-extrabold uppercase tracking-wider hover:bg-amber-300 transition-colors"
            >
              CLICK HERE
            </button>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#7c4dff] text-white text-xs font-bold uppercase tracking-wider">
              <span>▶</span>
              <span>INITIATIVES</span>
            </span>
          </div>
        </div>

        {/* Right Maroon Hexagonal/Badge Grid of 12 Initiatives */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4a1525 0%, #6b1d2f 55%, #3b0d1a 100%)',
          }}
          className="lg:col-span-8 p-6 md:p-8 flex items-center"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 w-full">
            {OFFICIAL_INITIATIVES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  onNavigateTab ? onNavigateTab(item.tab) : scrollToCatalog()
                }
                className="group bg-[#18181b]/90 hover:bg-[#be123c] text-white border border-white/20 rounded-xl p-3.5 text-center flex flex-col items-center justify-center min-h-[92px] transition-colors shadow-xs"
              >
                <span className="text-xs font-bold leading-snug group-hover:text-white">
                  {item.label}
                </span>
                <span className="text-[10px] text-amber-300 mt-1 font-medium">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
