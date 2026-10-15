#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const coursesPath = path.resolve(process.cwd(), 'backend/src/data/courses.json');

if (!fs.existsSync(coursesPath)) {
  console.error('❌ Could not find backend/src/data/courses.json');
  process.exit(1);
}

const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
const validDurations = new Set([4, 8, 12]);
const idPattern = /^noc26-[a-z]{2}\d{2}$/;
let errors = 0;

for (const c of courses) {
  if (!idPattern.test(c.id)) {
    console.error(`❌ Invalid course ID "${c.id}": must match /^noc26-[a-z]{2}\\d{2}$/`);
    errors++;
  }
  if (!validDurations.has(c.durationWeeks)) {
    console.error(`❌ Invalid durationWeeks (${c.durationWeeks}) for ${c.id}: must be 4, 8, or 12.`);
    errors++;
  }
  if (!Array.isArray(c.weeks) || c.weeks.length === 0) {
    console.error(`❌ Course ${c.id} must have at least 1 week module.`);
    errors++;
  } else {
    for (const w of c.weeks) {
      if (!w.transcripts || !w.transcripts.en || !w.transcripts.ta || !w.transcripts.hi) {
        console.error(`❌ Course ${c.id} Week ${w.weekNumber} is missing multilingual transcripts (en/ta/hi).`);
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n❌ Validation failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(`✅ NPTEL Course Catalog Validated Successfully! (${courses.length} courses compliant with IITM & SWAYAM schema)`);
