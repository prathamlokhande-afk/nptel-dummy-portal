import { Award, CheckCircle2, QrCode, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import type { NptelCertificate } from '../types/nptel';

interface CertificateVerifierProps {
  sampleCertificates: NptelCertificate[];
}

export const CertificateVerifier: React.FC<CertificateVerifierProps> = ({
  sampleCertificates,
}) => {
  const [certInput, setCertInput] = useState(
    sampleCertificates[0]?.certificateId ?? 'NPTEL26CS01S1049201'
  );
  const [verifiedCert, setVerifiedCert] = useState<NptelCertificate | null>(
    sampleCertificates[0] ?? null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (idToVerify: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `http://localhost:4000/api/certificates/${encodeURIComponent(idToVerify.trim())}/verify`
      );
      const json = await res.json();
      if (json.success) {
        setVerifiedCert(json.data);
      } else {
        setVerifiedCert(null);
        setErrorMessage(json.error?.message ?? 'Certificate verification failed.');
      }
    } catch {
      setErrorMessage('Unable to reach NPTEL Certificate Verification API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#990000]" />
            <span>NPTEL Authentic e-Certificate &amp; QR Verification Portal</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Verify candidate scores, assignment + proctored exam breakdowns, and AICTE/UGC credit
            eligibility directly against IIT Madras records.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(certInput);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <label htmlFor="cert-verify-input" className="sr-only">
              NPTEL Certificate Roll Number
            </label>
            <input
              id="cert-verify-input"
              type="text"
              required
              pattern="^NPTEL\d{2}[A-Za-z]{2}\d{2}S\d{7}$"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="Enter Certificate No. (e.g., NPTEL26CS01S1049201)"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 font-mono text-sm uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#990000] text-white text-sm font-bold hover:bg-[#7a0000] transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Verifying…' : 'Verify Certificate'}</span>
          </button>
        </form>

        {/* Quick Sample Pills for Live Demo */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500">Quick Demo Samples:</span>
          {sampleCertificates.map((sc) => (
            <button
              key={sc.certificateId}
              type="button"
              onClick={() => {
                setCertInput(sc.certificateId);
                handleVerify(sc.certificateId);
              }}
              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-[#990000] border border-slate-200 transition-colors"
            >
              {sc.certificateId} ({sc.badgeTier})
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-900 text-sm"
        >
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong>Verification Failed:</strong> {errorMessage}
          </div>
        </div>
      )}

      {verifiedCert && (
        <div className="bg-white rounded-2xl border-2 border-[#990000]/30 p-6 md:p-8 shadow-md relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Digitally Verified by NPTEL — IIT Madras</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {verifiedCert.studentName}
              </h2>
              <p className="text-xs font-medium text-slate-600">
                {verifiedCert.instituteName} • Local Chapter:{' '}
                <strong>{verifiedCert.localChapterId}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 px-4 py-2.5 rounded-xl">
              <Award className="w-7 h-7 text-[#990000]" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {verifiedCert.badgeTier}
                </div>
                {verifiedCert.topperRank && (
                  <div className="text-[11px] font-semibold text-[#990000]">
                    ★ {verifiedCert.topperRank}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Certified Course
            </div>
            <div className="text-lg font-bold text-slate-900">{verifiedCert.courseTitle}</div>
            <div className="text-xs text-slate-600">
              {verifiedCert.instructor} • {verifiedCert.semester} ({verifiedCert.durationWeeks}{' '}
              Weeks, {verifiedCert.credits} Recommended Credits)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs text-slate-500">Online Assignments</div>
              <div className="text-lg font-extrabold text-slate-900">
                {verifiedCert.assignmentScoreOut25} / 25
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Proctored Exam Score</div>
              <div className="text-lg font-extrabold text-slate-900">
                {verifiedCert.examScoreOut75} / 75
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Consolidated Score</div>
              <div className="text-xl font-extrabold text-[#990000]">
                {verifiedCert.totalScore}%
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500">
            <div className="font-mono">
              Roll / Certificate ID: <strong>{verifiedCert.certificateId}</strong> • Issued:{' '}
              {verifiedCert.issuedAt}
            </div>
            <div className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
              <QrCode className="w-4 h-4 text-[#990000]" />
              <span>QR Checksum Valid</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
