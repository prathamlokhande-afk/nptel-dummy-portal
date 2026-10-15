import {
  Award,
  BookOpen,
  Building2,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';

export type ActivePortalTab = 'catalog' | 'classroom' | 'certificates' | 'spoc';

interface HeaderProps {
  activeTab: ActivePortalTab;
  onSelectTab: (tab: ActivePortalTab) => void;
  selectedCourseTitle?: string;
}

export const NptelOfficialLogo: React.FC<{
  darkText?: boolean;
  size?: 'sm' | 'md';
}> = ({ darkText = false, size = 'md' }) => {
  const iconSize = size === 'sm' ? 30 : 36;
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer technical gear/wheel ring in official NPTEL maroon */}
        <circle cx="32" cy="32" r="28" stroke="#7b1f23" strokeWidth="4.5" fill="#ffffff" />
        <circle cx="32" cy="32" r="21" stroke="#7b1f23" strokeWidth="2.2" />
        {/* 8-spoke wheel lines */}
        <line x1="32" y1="6" x2="32" y2="58" stroke="#7b1f23" strokeWidth="2.5" />
        <line x1="6" y1="32" x2="58" y2="32" stroke="#7b1f23" strokeWidth="2.5" />
        <line x1="13.6" y1="13.6" x2="50.4" y2="50.4" stroke="#7b1f23" strokeWidth="2.5" />
        <line x1="50.4" y1="13.6" x2="13.6" y2="50.4" stroke="#7b1f23" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="7" fill="#7b1f23" />
        <circle cx="32" cy="32" r="3" fill="#ffffff" />
      </svg>
      <span
        className={`font-serif font-extrabold tracking-wider ${
          size === 'sm' ? 'text-xl' : 'text-2xl'
        } ${darkText ? 'text-white' : 'text-[#7b1f23]'}`}
        style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
      >
        NPTEL
      </span>
    </span>
  );
};

type DropdownKey = 'initiatives' | 'courses' | 'learners' | 'more' | null;

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  selectedCourseTitle,
}) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [loginToast, setLoginToast] = useState(false);

  const navigateAndScroll = (tab: ActivePortalTab, sectionId?: string) => {
    onSelectTab(tab);
    setOpenDropdown(null);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }
  };

  const toggleMenu = (menu: Exclude<DropdownKey, null>) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Official https://nptel.ac.in/ 60px Top Navigation Bar */}
      <div
        className="bg-white border-b border-slate-100"
        style={{
          minHeight: '60px',
          boxShadow:
            '0px 4px 8px rgba(96, 97, 112, 0.16), 0px 0px 2px rgba(40, 41, 61, 0.04)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-[60px] flex items-center justify-between gap-4">
          {/* Left: Official NPTEL Wheel Emblem + Wordmark */}
          <button
            type="button"
            onClick={() => navigateAndScroll('catalog')}
            className="flex items-center gap-2 text-left focus:outline-2 focus:outline-[#7b1f23] rounded-md py-1"
            aria-label="NPTEL Home — Return to Course Catalog"
          >
            <NptelOfficialLogo />
          </button>

          {/* Center: Official 5 nptel.ac.in Menu Items (Initiatives, Courses, Inspired Learners, Exams, More) */}
          <nav
            aria-label="Official NPTEL Navigation"
            className="hidden md:flex items-center gap-7 text-[16px] font-normal text-black"
          >
            {/* 1. Initiatives Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('initiatives')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleMenu('initiatives')}
                aria-expanded={openDropdown === 'initiatives'}
                aria-label="Initiatives menu"
                className={`inline-flex items-center gap-1.5 py-2 transition-colors ${
                  openDropdown === 'initiatives' || activeTab === 'spoc'
                    ? 'text-[#6698ff] font-medium'
                    : 'text-black hover:text-[#6698ff]'
                }`}
              >
                <span>Initiatives</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === 'initiatives' ? 'rotate-180 text-[#6698ff]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'initiatives' && (
                <div className="absolute left-0 top-full pt-1 w-60 z-50">
                  <div className="bg-white rounded-[10px] shadow-lg border border-slate-100 py-2 text-[14px] text-[#555770]">
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-initiatives')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      Learn about NPTEL
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('spoc')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors font-medium"
                    >
                      Local Chapters (SPOC)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('classroom')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors font-medium"
                    >
                      Translation (Bhashini)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-course-catalog')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      Faculty Initiatives (AICTE FDP)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-initiatives')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      GATE Preparation
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-initiatives')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      CSR &amp; Industry Associates
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-initiatives')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      Internship &amp; Workshops
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Courses Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('courses')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleMenu('courses')}
                aria-expanded={openDropdown === 'courses'}
                aria-label="Courses menu"
                className={`inline-flex items-center gap-1.5 py-2 transition-colors ${
                  openDropdown === 'courses' || activeTab === 'classroom'
                    ? 'text-[#6698ff] font-medium'
                    : 'text-black hover:text-[#6698ff]'
                }`}
              >
                <span>Courses</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === 'courses' ? 'rotate-180 text-[#6698ff]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'courses' && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-white rounded-[10px] shadow-lg border border-slate-100 py-2 text-[14px] text-[#555770]">
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-course-catalog')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors font-medium"
                    >
                      NPTEL Courses (Jul–Nov 2026)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('classroom')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors font-medium"
                    >
                      Course Classroom &amp; 25/75 Grading
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-course-catalog')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      Domains
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-initiatives')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      NPTEL+
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-coordinators')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      SWAYAM &amp; NPTEL
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-course-catalog')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      Medical Courses
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Inspired Learners Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('learners')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleMenu('learners')}
                aria-expanded={openDropdown === 'learners'}
                aria-label="Inspired Learners menu"
                className={`inline-flex items-center gap-1.5 py-2 transition-colors ${
                  openDropdown === 'learners'
                    ? 'text-[#6698ff] font-medium'
                    : 'text-black hover:text-[#6698ff]'
                }`}
              >
                <span>Inspired Learners</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === 'learners' ? 'rotate-180 text-[#6698ff]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'learners' && (
                <div className="absolute left-0 top-full pt-1 w-56 z-50">
                  <div className="bg-white rounded-[10px] shadow-lg border border-slate-100 py-2 text-[14px] text-[#555770]">
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-testimonials')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      NPTEL STARS
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-testimonials')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      NPTEL Testimonials
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-news')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      NPTEL Blog
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Exams (Direct link to Exam Certificate Verifier) */}
            <button
              type="button"
              onClick={() => navigateAndScroll('certificates')}
              className={`py-2 transition-colors ${
                activeTab === 'certificates'
                  ? 'text-[#6698ff] font-medium'
                  : 'text-black hover:text-[#6698ff]'
              }`}
            >
              Exams
            </button>

            {/* 5. More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('more')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleMenu('more')}
                aria-expanded={openDropdown === 'more'}
                aria-label="More menu"
                className={`inline-flex items-center gap-1.5 py-2 transition-colors ${
                  openDropdown === 'more'
                    ? 'text-[#6698ff] font-medium'
                    : 'text-black hover:text-[#6698ff]'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === 'more' ? 'rotate-180 text-[#6698ff]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'more' && (
                <div className="absolute right-0 top-full pt-1 w-56 z-50">
                  <div className="bg-white rounded-[10px] shadow-lg border border-slate-100 py-2 text-[14px] text-[#555770]">
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-news')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      News &amp; Announcements
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('certificates')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      Verify e-Certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-footer')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      About us &amp; FAQ
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndScroll('catalog', 'nptel-footer')}
                      className="w-full text-left px-4 py-2 hover:bg-[#94b7ff] hover:text-white transition-colors"
                    >
                      Documents &amp; Books
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Official Royal Blue "Log in" CTA (#005fff) */}
          <div className="flex items-center gap-3">
            {loginToast && (
              <span
                role="status"
                aria-live="polite"
                className="hidden lg:inline-block text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded"
              >
                Signed in as IIT Madras Coordinator (SWAYAM SSO)
              </span>
            )}
            <button
              type="button"
              onClick={() => setLoginToast((prev) => !prev)}
              style={{
                backgroundColor: '#005fff',
                padding: '7px 14px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="text-white hover:opacity-90 transition-opacity shadow-2xs"
            >
              {loginToast ? 'IITM Coordinator' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar: Direct 1-Click Portal Module Switcher & IIT Madras MoE Strip */}
      <div className="bg-[#f8f9fc] border-b border-slate-200/80 px-4 py-1.5">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7b1f23]" />
            <span>
              Coordinated by <strong className="text-slate-900">IIT Madras</strong> (MoE, Govt. of
              India) • Semester: <strong>Jul–Nov 2026</strong>
            </span>
          </div>

          <nav
            aria-label="Primary Portal Navigation"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => onSelectTab('catalog')}
              aria-current={activeTab === 'catalog' ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-[#7b1f23] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('classroom')}
              aria-current={activeTab === 'classroom' ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'classroom'
                  ? 'bg-[#7b1f23] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>
                Course Classroom &amp; Grading
                {selectedCourseTitle ? ` (${selectedCourseTitle.slice(0, 16)}…)` : ''}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('certificates')}
              aria-current={activeTab === 'certificates' ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'certificates'
                  ? 'bg-[#7b1f23] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify e-Certificate</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('spoc')}
              aria-current={activeTab === 'spoc' ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'spoc'
                  ? 'bg-[#7b1f23] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Local Chapters (SPOC)</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
