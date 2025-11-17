/**
 * CON-10: HTTPS Enforcement Middleware
 * Ensures secure API communication
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const httpsEnforcement = (req: Request, res: Response, next: NextFunction): void => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';

  if (process.env.ENABLE_HTTPS === 'true' && !isHttps) {
    logger.warn('HTTPS enforcement: redirecting HTTP request', {
      url: req.url,
      protocol: req.protocol,
      forwardedProto: req.headers['x-forwarded-proto'],
    });

    // Redirect to HTTPS
    const httpsUrl = `https://${req.get('host')}${req.originalUrl}`;
    res.redirect(301, httpsUrl);
    return;
  }

  next();
};

export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // HSTS header
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content-Security-Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  next();
};

