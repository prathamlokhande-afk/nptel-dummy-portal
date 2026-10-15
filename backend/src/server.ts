import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import certificatesRouter from './routes/certificates.js';
import coursesRouter from './routes/courses.js';
import gradingRouter from './routes/grading.js';
import spocRouter from './routes/spoc.js';
import { sendNptelSuccess } from './utils/apiResponse.js';

export const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  sendNptelSuccess(res, {
    service: 'NPTEL Online Certification Portal API (IIT Madras)',
    status: 'healthy',
    version: '2026.2.0',
  });
});

app.use('/api/courses', coursesRouter);
app.use('/api/grading', gradingRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/spoc', spocRouter);

const isMainModule =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🏛️  IIT Madras NPTEL Backend API listening on http://localhost:${PORT}`);
  });
}
