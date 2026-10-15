import React, { useEffect, useState } from 'react';
import { CertificateVerifier } from './components/CertificateVerifier';
import { CourseCatalog } from './components/CourseCatalog';
import { CourseClassroom } from './components/CourseClassroom';
import { Header, type ActivePortalTab } from './components/Header';
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
          fetch('/api/courses'),
          fetch('/api/certificates'),
          fetch('/api/spoc/analytics'),
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedCourseTitle={selectedCourse?.title}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm font-semibold text-slate-600">
            Loading IIT Madras NPTEL Portal Catalog &amp; Services…
          </div>
        ) : (
          <>
            {activeTab === 'catalog' && (
              <CourseCatalog courses={courses} onOpenCourse={handleOpenCourse} />
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

      <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-4 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <strong className="text-white">
              NPTEL — National Programme on Technology Enhanced Learning
            </strong>{' '}
            • IC&amp;SR Building, 3rd Floor, IIT Madras, Chennai — 600036
          </div>
          <div className="flex items-center gap-4">
            <span>Coordinated by IIT Madras</span>
            <span>•</span>
            <span>Powered by Google Antigravity Demo Environment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
