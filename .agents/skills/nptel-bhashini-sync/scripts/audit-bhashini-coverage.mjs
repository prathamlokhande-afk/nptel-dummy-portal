#!/usr/bin/env node
/**
 * NPTEL Bhashini Multilingual Transcript Coverage Auditor
 * Audits backend/src/data/courses.json for regional language completeness (en, ta, hi, te)
 * and outputs a structured readiness report for the IIT Madras translation pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';

const targetPath = process.argv[2] || 'backend/src/data/courses.json';
const resolvedPath = path.resolve(process.cwd(), targetPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`[Bhashini Auditor] File not found: ${resolvedPath}`);
  process.exit(1);
}

const courses = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
const REQUIRED_LANGS = ['en', 'ta', 'hi'];
const OPTIONAL_LANGS = ['te'];

let totalModules = 0;
let fullyCompliantModules = 0;
const courseSummaries = [];
const warnings = [];

for (const course of courses) {
  const modules = Array.isArray(course.weeks)
    ? course.weeks
    : Array.isArray(course.modules)
    ? course.modules
    : [];
  let langCounts = { en: 0, ta: 0, hi: 0, te: 0 };

  for (const mod of modules) {
    totalModules += 1;
    const t = mod.transcripts || {};
    let moduleOk = true;
    const weekNum = mod.weekNumber ?? mod.week;

    for (const lang of REQUIRED_LANGS) {
      if (typeof t[lang] === 'string' && t[lang].trim().length >= 20) {
        langCounts[lang] += 1;
      } else {
        moduleOk = false;
        warnings.push(`${course.id} Week ${weekNum}: Missing or short '${lang}' transcript.`);
      }
    }

    for (const lang of OPTIONAL_LANGS) {
      if (typeof t[lang] === 'string' && t[lang].trim().length >= 20) {
        langCounts[lang] += 1;
      }
    }

    if (moduleOk) {
      fullyCompliantModules += 1;
    }
  }

  const totalW = modules.length || 1;
  courseSummaries.push({
    courseId: course.id,
    title: course.title.slice(0, 38),
    institute: course.institute,
    weeks: modules.length,
    en: `${Math.round((langCounts.en / totalW) * 100)}%`,
    ta: `${Math.round((langCounts.ta / totalW) * 100)}%`,
    hi: `${Math.round((langCounts.hi / totalW) * 100)}%`,
    te: `${Math.round((langCounts.te / totalW) * 100)}%`,
  });
}

console.log('================================================================================');
console.log('  NPTEL BHASHINI MULTILINGUAL TRANSCRIPT AUDIT REPORT (IIT Madras)');
console.log('================================================================================');
console.table(courseSummaries);
console.log(`Total Courses Audited : ${courses.length}`);
console.log(`Total Weekly Modules  : ${totalModules}`);
console.log(`Core (EN/TA/HI) Ready : ${fullyCompliantModules}/${totalModules} (${Math.round((fullyCompliantModules / Math.max(1, totalModules)) * 100)}%)`);

if (warnings.length > 0) {
  console.error('\n[WARNINGS DETECTED]:');
  for (const w of warnings) {
    console.error(`  - ${w}`);
  }
  process.exit(1);
} else {
  console.log('\n[PASS] All courses meet mandatory Bhashini (EN, TA, HI) transcript standards.');
}
