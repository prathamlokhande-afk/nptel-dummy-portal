import type { Response } from 'express';

export interface NptelMeta {
  semester: string;
  coordinatingInstitute: string;
  timestamp: string;
}

export function buildNptelMeta(): NptelMeta {
  return {
    semester: 'Jul-Nov 2026',
    coordinatingInstitute: 'IIT Madras',
    timestamp: new Date().toISOString(),
  };
}

export function sendNptelSuccess<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({
    success: true,
    nptelMeta: buildNptelMeta(),
    data,
  });
}

export function sendNptelError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400
): void {
  res.status(statusCode).json({
    success: false,
    nptelMeta: buildNptelMeta(),
    error: {
      code,
      message,
    },
  });
}
