#!/usr/bin/env node
/**
 * Antigravity Lifecycle Hook: PreToolUse (run_command Guardrail)
 * Blocks destructive commands targeting NPTEL production seed data (certificates.json, courses.json)
 * or unmasked PII dumps before execution.
 * Follows the official Antigravity PreToolUse stdin/stdout JSON contract.
 */
import fs from 'node:fs';

let rawInput = '';
try {
  rawInput = fs.readFileSync(0, 'utf8');
} catch {
  // No stdin provided
}

let payload = {};
try {
  payload = rawInput ? JSON.parse(rawInput) : {};
} catch {
  payload = {};
}

const commandLine = String(payload?.toolCall?.args?.CommandLine || '');

const BLOCKED_PATTERNS = [
  {
    regex: /\brm\s+(-[rRf]+\s+)?.*backend\/src\/data\/(certificates|courses|spoc_analytics)\.json/i,
    reason:
      'NPTEL Production Safety Gate: Deleting core NPTEL seed datasets (certificates.json / courses.json / spoc_analytics.json) is prohibited.',
  },
  {
    regex: /\bgit\s+push\s+.*--force\b/i,
    reason:
      'NPTEL Production Safety Gate: Force-pushing to protected IIT Madras branches is blocked by .agents/hooks.json.',
  },
];

for (const rule of BLOCKED_PATTERNS) {
  if (rule.regex.test(commandLine)) {
    process.stdout.write(
      JSON.stringify({
        decision: 'deny',
        reason: rule.reason,
      }) + '\n'
    );
    process.exit(0);
  }
}

process.stdout.write(JSON.stringify({ decision: 'allow' }) + '\n');
