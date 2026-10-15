#!/usr/bin/env node
/**
 * Antigravity Lifecycle Hook: PostToolUse (Catalog Schema & Bhashini Verification)
 * Validates backend/src/data/courses.json after file-editing tool calls and outputs `{}` to stdout
 * per the official Antigravity PostToolUse contract.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const validatorScript = path.resolve(
  repoRoot,
  '.agents/skills/nptel-course-ingestor/scripts/validate-course.mjs'
);
const coursesJson = path.resolve(repoRoot, 'backend/src/data/courses.json');

const res = spawnSync(process.execPath, [validatorScript, coursesJson], {
  cwd: repoRoot,
  encoding: 'utf8',
});

if (res.status !== 0) {
  process.stderr.write(`[PostToolUse Catalog Validator Warning]: ${res.stderr || res.stdout}\n`);
}

// PostToolUse contract requires `{}` on stdout
process.stdout.write('{}\n');
