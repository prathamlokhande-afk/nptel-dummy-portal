import { Award, BookOpen, Building2, GraduationCap, ShieldCheck } from 'lucide-react';
import React from 'react';

export type ActivePortalTab = 'catalog' | 'classroom' | 'certificates' | 'spoc';

interface HeaderProps {
  activeTab: ActivePortalTab;
  onSelectTab: (tab: ActivePortalTab) => void;
  selectedCourseTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  selectedCourseTitle,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-xs">
      {/* Top Ministry of Education / IIT Madras GIGW Compliance Bar */}
      <div className="bg-[#7a0000] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <span>
              An Initiative of Ministry of Education (MoE), Govt. of India • Coordinated by{' '}
              <strong>IIT Madras</strong> (Seven IITs &amp; IISc)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-amber-100">
            <span>SWAYAM National Coordinator</span>
            <span aria-hidden="true">|</span>
            <span>Semester: Jul–Nov 2026</span>
            <span aria-hidden="true">|</span>
            <span className="bg-white/15 px-2 py-0.5 rounded-sm font-semibold text-white">
              GIGW 3.0 &amp; WCAG 2.1 AA
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onSelectTab('catalog')}
          className="flex items-center gap-3 text-left group focus:outline-2 focus:outline-[#990000] rounded-lg p-1"
          aria-label="Return to NPTEL Course Catalog Home"
        >
          <div className="w-11 h-11 rounded-lg bg-[#990000] text-white flex items-center justify-center shadow-xs group-hover:bg-[#7a0000] transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#990000]">
                NPTEL
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                IIT Madras Hub
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Online Certification &amp; Multilingual Learning Portal
            </p>
          </div>
        </button>

        <nav aria-label="Primary Portal Navigation" className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectTab('catalog')}
            aria-current={activeTab === 'catalog' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'catalog'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('classroom')}
            aria-current={activeTab === 'classroom' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'classroom'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>
              Course Classroom &amp; Grading
              {selectedCourseTitle ? ` (${selectedCourseTitle.slice(0, 18)}…)` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('certificates')}
            aria-current={activeTab === 'certificates' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'certificates'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify e-Certificate</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('spoc')}
            aria-current={activeTab === 'spoc' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'spoc'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Local Chapters (SPOC)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
