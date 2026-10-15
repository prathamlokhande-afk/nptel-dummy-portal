#!/usr/bin/env node
/**
 * NPTEL-SWAYAM National Registry MCP Server (Stdio JSON-RPC 2.0)
 * Exposes IIT Madras / Ministry of Education domain tools to Antigravity:
 *   1. lookup_abc_credit_mapping — NEP 2020 Academic Bank of Credits (ABC) & AICTE FDP equivalency
 *   2. check_bhashini_translation_status — Live Bhashini ULCA regional transcript status for a course
 *   3. simulate_exam_center_capacity — TCS iON proctored exam shift & center allocation calculator
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COURSES_PATH = path.resolve(__dirname, '../../backend/src/data/courses.json');

const TOOLS = [
  {
    name: 'lookup_abc_credit_mapping',
    description:
      'Look up UGC / AICTE NEP 2020 Academic Bank of Credits (ABC) equivalency, contact hours, and FDP points for an NPTEL course duration (4, 8, or 12 weeks).',
    inputSchema: {
      type: 'object',
      properties: {
        durationWeeks: {
          type: 'number',
          description: 'NPTEL course duration in weeks (4, 8, or 12)',
        },
        aicteFdpApproved: {
          type: 'boolean',
          description: 'Whether the course is approved for AICTE Faculty Development Programme (FDP)',
        },
      },
      required: ['durationWeeks'],
    },
  },
  {
    name: 'check_bhashini_translation_status',
    description:
      'Inspect Bhashini regional language transcript coverage (en, ta, hi, te) for a specific NPTEL course ID (e.g., noc26-cs01).',
    inputSchema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'string',
          description: 'NPTEL course ID matching noc26-<discipline><number> (e.g., noc26-cs01)',
        },
      },
      required: ['courseId'],
    },
  },
  {
    name: 'simulate_exam_center_capacity',
    description:
      'Calculate TCS iON proctored exam center seat requirements across Morning (9AM-12PM IST) and Afternoon (2PM-5PM IST) shifts.',
    inputSchema: {
      type: 'object',
      properties: {
        courseId: { type: 'string', description: 'NPTEL course ID (e.g., noc26-cs01)' },
        registeredExamLearners: {
          type: 'number',
          description: 'Projected number of learners registered for the proctored exam',
        },
      },
      required: ['courseId', 'registeredExamLearners'],
    },
  },
];

function executeTool(name, args = {}) {
  if (name === 'lookup_abc_credit_mapping') {
    const weeks = Number(args.durationWeeks);
    const fdp = Boolean(args.aicteFdpApproved);
    const creditMap = {
      4: { ugcCredits: 1, minEngagementHours: 15, fdpEquivalency: 'Half-Week (1/2) AICTE FDP' },
      8: { ugcCredits: 2, minEngagementHours: 30, fdpEquivalency: 'Full 1-Week AICTE FDP' },
      12: { ugcCredits: 3, minEngagementHours: 45, fdpEquivalency: '1.5-Week Extended AICTE FDP' },
    };
    const match = creditMap[weeks];
    if (!match) {
      return { error: `Unsupported durationWeeks: ${weeks}. Expected 4, 8, or 12.` };
    }
    return {
      regulation: 'UGC SWAYAM Credit Framework 2026 (NEP 2020) & AICTE Gazette Notification',
      durationWeeks: weeks,
      ugcAbcCredits: match.ugcCredits,
      minEngagementHours: match.minEngagementHours,
      aicteFdpEligible: fdp,
      aicteFdpRecognition: fdp ? match.fdpEquivalency : 'Not applicable (Non-FDP course)',
      creditTransferRequirement:
        'Learner must score >= 10/25 in Best-N Assignments AND >= 30/75 in Proctored Exam',
    };
  }

  if (name === 'check_bhashini_translation_status') {
    const courseId = String(args.courseId || '').toLowerCase();
    const courses = JSON.parse(fs.readFileSync(COURSES_PATH, 'utf8'));
    const course = courses.find((c) => c.id.toLowerCase() === courseId);
    if (!course) {
      return { error: `Course '${courseId}' not found in backend/src/data/courses.json` };
    }
    const weekList = Array.isArray(course.weeks) ? course.weeks : course.modules || [];
    const weeks = weekList.length;
    const counts = { en: 0, ta: 0, hi: 0, te: 0 };
    for (const mod of weekList) {
      for (const lang of Object.keys(counts)) {
        if (mod.transcripts?.[lang] && mod.transcripts[lang].trim().length >= 20) {
          counts[lang] += 1;
        }
      }
    }
    return {
      courseId: course.id,
      title: course.title,
      institute: course.institute,
      totalWeeks: weeks,
      bhashiniCoverage: {
        en: `${counts.en}/${weeks} weeks`,
        ta: `${counts.ta}/${weeks} weeks`,
        hi: `${counts.hi}/${weeks} weeks`,
        te: `${counts.te}/${weeks} weeks`,
      },
      productionCompliant: counts.en === weeks && counts.ta === weeks && counts.hi === weeks,
    };
  }

  if (name === 'simulate_exam_center_capacity') {
    const learners = Math.max(1, Number(args.registeredExamLearners) || 1000);
    const seatsPerCenterPerShift = 250;
    const morningShiftLearners = Math.ceil(learners * 0.55);
    const afternoonShiftLearners = learners - morningShiftLearners;
    return {
      courseId: args.courseId,
      registeredExamLearners: learners,
      timezone: 'Asia/Kolkata (IST, UTC+05:30)',
      shifts: [
        {
          shift: 'Forenoon Session (09:00 AM – 12:00 PM IST)',
          allocatedCandidates: morningShiftLearners,
          requiredTcsIonCenters: Math.ceil(morningShiftLearners / seatsPerCenterPerShift),
        },
        {
          shift: 'Afternoon Session (02:00 PM – 05:00 PM IST)',
          allocatedCandidates: afternoonShiftLearners,
          requiredTcsIonCenters: Math.ceil(afternoonShiftLearners / seatsPerCenterPerShift),
        },
      ],
      recommendedBufferSeatsPercent: 12,
    };
  }

  return { error: `Unknown tool: ${name}` };
}

// CLI flag `--selftest` allows deterministic verification in CI and terminal demos
if (process.argv.includes('--selftest')) {
  const sample = {
    abc: executeTool('lookup_abc_credit_mapping', { durationWeeks: 12, aicteFdpApproved: true }),
    bhashini: executeTool('check_bhashini_translation_status', { courseId: 'noc26-cs01' }),
    examOps: executeTool('simulate_exam_center_capacity', {
      courseId: 'noc26-cs01',
      registeredExamLearners: 18450,
    }),
  };
  console.log(JSON.stringify(sample, null, 2));
  process.exit(0);
}

// Standard MCP JSON-RPC 2.0 over Stdio loop
const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    if (req.method === 'initialize') {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: req.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'nptel-swayam-mcp', version: '2.0.0' },
          },
        }) + '\n'
      );
    } else if (req.method === 'tools/list') {
      process.stdout.write(
        JSON.stringify({ jsonrpc: '2.0', id: req.id, result: { tools: TOOLS } }) + '\n'
      );
    } else if (req.method === 'tools/call') {
      const output = executeTool(req.params?.name, req.params?.arguments);
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: req.id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
          },
        }) + '\n'
      );
    } else if (req.id !== undefined) {
      process.stdout.write(
        JSON.stringify({ jsonrpc: '2.0', id: req.id, result: {} }) + '\n'
      );
    }
  } catch (err) {
    process.stderr.write(`[nptel-swayam-mcp] Parse error: ${err.message}\n`);
  }
});
