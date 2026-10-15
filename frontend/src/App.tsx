import React, { useEffect, useState } from 'react';
import { CertificateVerifier } from './components/CertificateVerifier';
import { CourseCatalog } from './components/CourseCatalog';
import { CourseClassroom } from './components/CourseClassroom';
import { Header, NptelOfficialLogo, type ActivePortalTab } from './components/Header';
import { SpocDashboard } from './components/SpocDashboard';
import type { NptelCertificate, NptelCourse, SpocAnalyticsData } from './types/nptel';

export function App() {
  const [activeTab, setActiveTab] = useState<ActivePortalTab>('catalog');
  const [courses, setCourses] = useState<NptelCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<NptelCourse | null>(null);
  const [sampleCertificates, setSampleCertificates] = useState<NptelCertificate[]>([]);
  const [spocAnalytics, setSpocAnalytics] = useState<SpocAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrapPortal() {
      try {
        const [coursesRes, certsRes, spocRes] = await Promise.all([
          fetch('http://localhost:4000/api/courses'),
          fetch('http://localhost:4000/api/certificates'),
          fetch('http://localhost:4000/api/spoc/analytics'),
        ]);

        const coursesJson = await coursesRes.json();
        const certsJson = await certsRes.json();
        const spocJson = await spocRes.json();

        if (coursesJson.success && Array.isArray(coursesJson.data.courses)) {
          setCourses(coursesJson.data.courses);
          setSelectedCourse(coursesJson.data.courses[0] ?? null);
        }
        if (certsJson.success && Array.isArray(certsJson.data)) {
          setSampleCertificates(certsJson.data);
        }
        if (spocJson.success) {
          setSpocAnalytics(spocJson.data);
        }
      } catch (err) {
        console.error('Failed to load NPTEL portal data:', err);
      } finally {
        setLoading(false);
      }
    }
    bootstrapPortal();
  }, []);

  const handleOpenCourse = (course: NptelCourse) => {
    setSelectedCourse(course);
    setActiveTab('classroom');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-slate-900">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedCourseTitle={selectedCourse?.title}
      />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-6">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm font-semibold text-slate-600">
            Loading IIT Madras NPTEL Portal Catalog &amp; Services…
          </div>
        ) : (
          <>
            {activeTab === 'catalog' && (
              <CourseCatalog
                courses={courses}
                onOpenCourse={handleOpenCourse}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'classroom' && selectedCourse && (
              <CourseClassroom
                course={selectedCourse}
                allCourses={courses}
                onSelectCourse={setSelectedCourse}
                onBackToCatalog={() => setActiveTab('catalog')}
              />
            )}

            {activeTab === 'certificates' && (
              <CertificateVerifier sampleCertificates={sampleCertificates} />
            )}

            {activeTab === 'spoc' && <SpocDashboard analytics={spocAnalytics} />}
          </>
        )}
      </main>

      {/* Official https://nptel.ac.in/ 3-Column Footer (#fafafc) */}
      <footer
        id="nptel-footer"
        style={{ backgroundColor: '#fafafc' }}
        className="border-t border-slate-200 text-black mt-16 pt-12 pb-8 px-4 md:px-8"
      >
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-10">
          {/* Column 1: Official NPTEL Logo + Resource Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="pb-1">
              <NptelOfficialLogo size="sm" />
            </div>
            <ul className="space-y-2 text-[14px] text-black">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="hover:text-[#7b1f23] transition-colors"
                >
                  Documents
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="hover:text-[#7b1f23] transition-colors"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('classroom')}
                  className="hover:text-[#7b1f23] transition-colors"
                >
                  Help Videos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('classroom')}
                  className="hover:text-[#7b1f23] transition-colors"
                >
                  Live Sessions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="hover:text-[#7b1f23] transition-colors"
                >
                  Code of Conduct
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="hover:text-[#7b1f23] transition-colors"
                >
                  NPTEL Hard-disk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="hover:text-[#7b1f23] transition-colors"
                >
                  Information on NPTEL semesters
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Creative Commons License Badge & AMAeSI */}
          <div className="md:col-span-4 space-y-3 text-[14px]">
            <p className="font-bold text-black">License</p>
            <div className="inline-flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold tracking-wider">
              <span>CC</span>
              <span>BY-NC-SA</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Distributed under Creative Commons Attribution-ShareAlike
              <br />
              CC BY - NC - SA
            </p>
            <p className="pt-2 font-semibold text-black">AMAeSI</p>
          </div>

          {/* Column 3: Official Contact Us (IIT Madras IC&SR Building) */}
          <div className="md:col-span-5 space-y-2.5 text-[14px]">
            <h2 className="text-[18px] font-bold text-black">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              For any queries regarding the NPTEL website, availability of courses or issues in
              accessing courses, please contact
            </p>
            <address className="not-italic text-slate-800 space-y-1 leading-relaxed pt-1">
              <p>NPTEL Administrator,</p>
              <p>IC &amp; SR, 3rd floor,</p>
              <p>IIT Madras, Chennai - 600036</p>
              <p className="pt-1">
                Tel : (044) 2257 5905, (044) 2257 5908, 9363218521 (Mon-Fri 9am-6pm)
              </p>
              <p>
                Email :{' '}
                <a
                  href="mailto:support@nptel.iitm.ac.in"
                  className="underline hover:text-[#7b1f23]"
                >
                  support@nptel.iitm.ac.in
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Copyright & Social Icons Row */}
        <div className="max-w-[1140px] mx-auto pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-[14px] text-black">
          <p>© - 2026 All rights reserved</p>
          <div className="flex items-center gap-2.5" aria-label="NPTEL Social Media Links">
            {[
              { label: 'NPTEL Facebook', short: 'f' },
              { label: 'NPTEL X (Twitter)', short: '𝕏' },
              { label: 'NPTEL Instagram', short: 'IG' },
              { label: 'NPTEL LinkedIn', short: 'in' },
              { label: 'NPTEL YouTube Channel', short: '▶' },
            ].map((soc) => (
              <span
                key={soc.label}
                aria-label={soc.label}
                style={{ backgroundColor: '#8f90a6' }}
                className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold select-none"
              >
                {soc.short}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
