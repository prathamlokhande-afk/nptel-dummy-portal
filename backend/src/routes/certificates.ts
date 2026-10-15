import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendNptelError, sendNptelSuccess } from '../utils/apiResponse.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certificatesPath = path.resolve(__dirname, '../data/certificates.json');

const CERT_ID_PATTERN = /^NPTEL\d{2}[A-Z]{2}\d{2}S\d{7}$/i;

function loadCertificates() {
  return JSON.parse(fs.readFileSync(certificatesPath, 'utf8'));
}

/**
 * GET /api/certificates
 * Returns list of sample verifiable certificates for quick demo inspection
 */
router.get('/', (_req, res) => {
  const certs = loadCertificates();
  sendNptelSuccess(res, certs);
});

/**
 * GET /api/certificates/:certId/verify
 * Verifies an NPTEL e-Certificate ID
 */
router.get('/:certId/verify', (req, res) => {
  const { certId } = req.params;

  if (!CERT_ID_PATTERN.test(certId)) {
    sendNptelError(
      res,
      'NPTEL_ERR_INVALID_CERTIFICATE_ID',
      `Certificate ID "${certId}" does not match official NPTEL format (e.g., NPTEL26CS01S1049201).`,
      400
    );
    return;
  }

  const certs = loadCertificates();
  const found = certs.find(
    (c: { certificateId: string }) => c.certificateId.toUpperCase() === certId.toUpperCase()
  );

  if (!found) {
    sendNptelError(
      res,
      'NPTEL_ERR_CERTIFICATE_NOT_FOUND',
      `No verified NPTEL certificate found matching ID "${certId}".`,
      404
    );
    return;
  }

  sendNptelSuccess(res, found);
});

export default router;
