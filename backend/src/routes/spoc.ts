import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendNptelSuccess } from '../utils/apiResponse.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spocStatsPath = path.resolve(__dirname, '../data/spocStats.json');

/**
 * GET /api/spoc/analytics
 * Returns Local Chapter (SPOC) leaderboard and national semester statistics
 */
router.get('/analytics', (req, res) => {
  const raw = JSON.parse(fs.readFileSync(spocStatsPath, 'utf8'));
  const { state } = req.query;

  let chapters = raw.chapters;
  if (typeof state === 'string' && state !== 'All') {
    chapters = chapters.filter(
      (ch: { state: string }) => ch.state.toLowerCase() === state.toLowerCase()
    );
  }

  sendNptelSuccess(res, {
    summary: raw.summary,
    chapters,
  });
});

export default router;
