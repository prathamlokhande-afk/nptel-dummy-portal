import { Award, Building2, Globe2, Trophy, Users } from 'lucide-react';
import React, { useState } from 'react';
import type { SpocAnalyticsData } from '../types/nptel';

interface SpocDashboardProps {
  analytics: SpocAnalyticsData | null;
}

export const SpocDashboard: React.FC<SpocDashboardProps> = ({ analytics }) => {
  const [selectedState, setSelectedState] = useState('All');

  if (!analytics) {
    return <p className="text-sm text-slate-600">Loading Local Chapter (SPOC) analytics…</p>;
  }

  const states = [
    'All',
    ...Array.from(new Set(analytics.chapters.map((c) => c.state))),
  ];

  const filteredChapters =
    selectedState === 'All'
      ? analytics.chapters
      : analytics.chapters.filter((c) => c.state === selectedState);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#990000]" />
            <span>NPTEL Local Chapter &amp; SPOC National Dashboard</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Single Point of Contact (SPOC) partner college metrics, AICTE FDP faculty participation,
            and national medal tallies coordinated by IIT Madras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="spoc-state-filter"
            className="text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            State Filter:
          </label>
          <select
            id="spoc-state-filter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* National SPOC KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-red-50 text-[#990000] flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {analytics.summary.totalLocalChapters.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Active Local Chapter Colleges</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {(analytics.summary.examRegistrationsConfirmed / 100000).toFixed(2)} Lakh
            </div>
            <div className="text-xs text-slate-500">Confirmed Exam Registrations</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {(analytics.summary.fdpFacultyEnrolled / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-slate-500">AICTE FDP Faculty Enrolled</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {analytics.summary.regionalTranslationsAvailable} Languages
            </div>
            <div className="text-xs text-slate-500">Bhashini / NPTEL Translation Reach</div>
          </div>
        </div>
      </div>

      {/* SPOC Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Top Performing Local Chapters (Jul–Nov 2026 Semester)</span>
          </h2>
          <span className="text-xs text-slate-500">
            Showing {filteredChapters.length} Chapter(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">LC Code</th>
                <th className="py-3 px-4">College &amp; SPOC Coordinator</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Exam Reg.</th>
                <th className="py-3 px-4 text-right">Elite + Gold</th>
                <th className="py-3 px-4 text-right">FDP Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredChapters.map((ch) => (
                <tr key={ch.chapterId} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#990000]">
                    {ch.chapterId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{ch.collegeName}</div>
                    <div className="text-xs text-slate-500">
                      SPOC: {ch.spocName} • {ch.city}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-700">{ch.state}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      {ch.rating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                    {ch.examRegistered.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#990000]">
                    {ch.eliteGoldCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-800">
                    {ch.fdpCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
