import assert from 'node:assert/strict';
import { IncomingMessage, ServerResponse, type Server } from 'node:http';
import { Socket, type AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { app } from '../src/server.js';

/**
 * Dispatches an HTTP request directly through the Express `app` when the OS sandbox
 * blocks loopback TCP connections (`EPERM`), returning a standard Fetch `Response`.
 */
async function dispatchInProcess(
  urlPath: string,
  init?: RequestInit
): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    const socket = new Socket();
    const req = new IncomingMessage(socket);
    req.url = urlPath;
    req.method = init?.method ?? 'GET';

    const headers: Record<string, string> = {};
    if (init?.headers) {
      for (const [k, v] of Object.entries(init.headers as Record<string, string>)) {
        headers[k.toLowerCase()] = v;
      }
    }
    const bodyStr = typeof init?.body === 'string' ? init.body : '';
    if (bodyStr) {
      headers['content-length'] = String(Buffer.byteLength(bodyStr));
    }
    req.headers = headers;

    const res = new ServerResponse(req);
    const chunks: Buffer[] = [];

    const origWrite = res.write.bind(res);
    const origEnd = res.end.bind(res);

    res.write = ((chunk: unknown, encoding?: unknown, cb?: unknown) => {
      if (chunk) {
        chunks.push(
          Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(String(chunk), typeof encoding === 'string' ? (encoding as BufferEncoding) : 'utf8')
        );
      }
      return origWrite(chunk as never, encoding as never, cb as never);
    }) as typeof res.write;

    res.end = ((chunk?: unknown, encoding?: unknown, cb?: unknown) => {
      if (chunk && typeof chunk !== 'function') {
        chunks.push(
          Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(String(chunk), typeof encoding === 'string' ? (encoding as BufferEncoding) : 'utf8')
        );
      }
      origEnd(chunk as never, encoding as never, cb as never);
      const rawPayload = Buffer.concat(chunks).toString('utf8');
      resolve(
        new Response(rawPayload, {
          status: res.statusCode,
        })
      );
      return res;
    }) as typeof res.end;

    try {
      app(req, res);
      if (bodyStr) {
        req.push(bodyStr);
      }
      req.push(null);
    } catch (err) {
      reject(err);
    }
  });
}

describe('NPTEL Backend HTTP API Integration Tests', () => {
  let server: Server;
  let baseUrl = '';

  async function apiFetch(urlPath: string, init?: RequestInit): Promise<Response> {
    try {
      return await fetch(`${baseUrl}${urlPath}`, init);
    } catch (err: unknown) {
      const cause = (err as { cause?: { code?: string } })?.cause;
      if (cause?.code === 'EPERM' || cause?.code === 'EACCES') {
        return dispatchInProcess(urlPath, init);
      }
      throw err;
    }
  }

  before(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('GET /api/health returns 200 with standard NPTEL envelope and healthy status', async () => {
    const res = await apiFetch('/api/health');
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.nptelMeta.coordinatingInstitute, 'IIT Madras');
    assert.equal(body.nptelMeta.semester, 'Jul-Nov 2026');
    assert.equal(body.data.status, 'healthy');
    assert.equal(
      body.data.service,
      'NPTEL Online Certification Portal API (IIT Madras)'
    );
  });

  it('GET /api/courses returns 200 with 6 courses and supports discipline & search filtering', async () => {
    const res = await apiFetch('/api/courses');
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.totalCount, 6);
    assert.equal(Array.isArray(body.data.courses), true);
    assert.equal(body.data.courses.length, 6);

    // Filter by discipline ("Computer Science and Engineering")
    const csRes = await apiFetch(
      '/api/courses?discipline=Computer%20Science%20and%20Engineering'
    );
    assert.equal(csRes.status, 200);
    const csBody = await csRes.json();
    assert.equal(csBody.success, true);
    assert.equal(csBody.data.courses.length, 4);

    // Filter by search ("Python" matches noc26-cs01; "Quantum" returns empty list cleanly)
    const pyRes = await apiFetch('/api/courses?search=Python');
    assert.equal(pyRes.status, 200);
    const pyBody = await pyRes.json();
    assert.equal(pyBody.success, true);
    assert.equal(pyBody.data.courses.length, 1);
    assert.equal(pyBody.data.courses[0].id, 'noc26-cs01');

    const quantumRes = await apiFetch('/api/courses?search=Quantum');
    assert.equal(quantumRes.status, 200);
    const quantumBody = await quantumRes.json();
    assert.equal(quantumBody.success, true);
    assert.equal(Array.isArray(quantumBody.data.courses), true);
    assert.equal(quantumBody.data.courses.length, 0);
  });

  it('GET /api/courses/:id returns 200 for noc26-cs01, 400 for invalid code format, and 404 for unknown course', async () => {
    const res = await apiFetch('/api/courses/noc26-cs01');
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.id, 'noc26-cs01');
    assert.equal(Array.isArray(body.data.weeks), true);
    assert.ok(body.data.weeks[0].transcripts.en);
    assert.ok(body.data.weeks[0].transcripts.ta);
    assert.ok(body.data.weeks[0].transcripts.hi);

    // Non-matching ID format -> 400 NPTEL_ERR_INVALID_COURSE_ID
    const invalidRes = await apiFetch('/api/courses/non-existent');
    assert.equal(invalidRes.status, 400);
    const invalidBody = await invalidRes.json();
    assert.equal(invalidBody.success, false);
    assert.equal(invalidBody.error.code, 'NPTEL_ERR_INVALID_COURSE_ID');

    // Valid noc26-* format but not in catalog -> 404 NPTEL_ERR_COURSE_NOT_FOUND
    const notFoundRes = await apiFetch('/api/courses/noc26-cs99');
    assert.equal(notFoundRes.status, 404);
    const notFoundBody = await notFoundRes.json();
    assert.equal(notFoundBody.success, false);
    assert.equal(notFoundBody.error.code, 'NPTEL_ERR_COURSE_NOT_FOUND');
  });

  it('POST /api/grading/calculate returns 200 with breakdown & simulatorTargets, and 400 for invalid payloads', async () => {
    const validRes = await apiFetch('/api/grading/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durationWeeks: 8,
        assignmentScores: [90, 85, 88, 92, 70, 95, 80, 60],
        examScoreOut100: 84,
      }),
    });
    assert.equal(validRes.status, 200);
    const validBody = await validRes.json();
    assert.equal(validBody.success, true);
    assert.equal(validBody.data.bestNCount, 6);
    assert.equal(typeof validBody.data.assignmentScoreOut25, 'number');
    assert.equal(typeof validBody.data.examScoreOut75, 'number');
    assert.equal(typeof validBody.data.totalScoreOut100, 'number');
    assert.equal(validBody.data.isQualifiedForCertificate, true);
    assert.equal(Array.isArray(validBody.data.simulatorTargets), true);
    assert.equal(validBody.data.simulatorTargets.length, 4);

    // Invalid durationWeeks -> 400 NPTEL_ERR_INVALID_DURATION
    const badDurationRes = await apiFetch('/api/grading/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durationWeeks: 6,
        assignmentScores: [80, 85, 90],
        examScoreOut100: 75,
      }),
    });
    assert.equal(badDurationRes.status, 400);
    const badDurationBody = await badDurationRes.json();
    assert.equal(badDurationBody.success, false);
    assert.equal(badDurationBody.error.code, 'NPTEL_ERR_INVALID_DURATION');

    // Invalid assignmentScores -> 400 NPTEL_ERR_INVALID_ASSIGNMENTS
    const badAssignmentsRes = await apiFetch('/api/grading/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durationWeeks: 8,
        assignmentScores: [],
        examScoreOut100: 75,
      }),
    });
    assert.equal(badAssignmentsRes.status, 400);
    const badAssignmentsBody = await badAssignmentsRes.json();
    assert.equal(badAssignmentsBody.success, false);
    assert.equal(badAssignmentsBody.error.code, 'NPTEL_ERR_INVALID_ASSIGNMENTS');
  });

  it('GET /api/certificates/:certId/verify verifies authentic certificate and rejects invalid/missing IDs', async () => {
    const validRes = await apiFetch(
      '/api/certificates/NPTEL26CS01S1049201/verify'
    );
    assert.equal(validRes.status, 200);
    const validBody = await validRes.json();
    assert.equal(validBody.success, true);
    assert.equal(validBody.data.certificateId, 'NPTEL26CS01S1049201');
    assert.equal(validBody.data.verified, true);
    assert.equal(validBody.data.badgeTier, 'Elite + Gold');

    // Malformed ID -> 400 NPTEL_ERR_INVALID_CERTIFICATE_ID
    const invalidFormatRes = await apiFetch(
      '/api/certificates/INVALID-ID/verify'
    );
    assert.equal(invalidFormatRes.status, 400);
    const invalidFormatBody = await invalidFormatRes.json();
    assert.equal(invalidFormatBody.success, false);
    assert.equal(
      invalidFormatBody.error.code,
      'NPTEL_ERR_INVALID_CERTIFICATE_ID'
    );

    // Valid format but non-existent ID -> 404 NPTEL_ERR_CERTIFICATE_NOT_FOUND
    const notFoundRes = await apiFetch(
      '/api/certificates/NPTEL26CS01S9999999/verify'
    );
    assert.equal(notFoundRes.status, 404);
    const notFoundBody = await notFoundRes.json();
    assert.equal(notFoundBody.success, false);
    assert.equal(notFoundBody.error.code, 'NPTEL_ERR_CERTIFICATE_NOT_FOUND');
  });

  it('GET /api/spoc/analytics returns 200 with summary and chapters, and filters by state', async () => {
    const res = await apiFetch('/api/spoc/analytics');
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.summary);
    assert.equal(Array.isArray(body.data.chapters), true);
    assert.equal(body.data.chapters.length, 5);

    const tnRes = await apiFetch(
      '/api/spoc/analytics?state=Tamil%20Nadu'
    );
    assert.equal(tnRes.status, 200);
    const tnBody = await tnRes.json();
    assert.equal(tnBody.success, true);
    assert.equal(tnBody.data.chapters.length, 2);
    assert.equal(
      tnBody.data.chapters.every(
        (ch: { state: string }) => ch.state === 'Tamil Nadu'
      ),
      true
    );
  });
});
