/**
 * CON-10: HTTPS Enforcement Middleware
 * Ensures secure API communication with comprehensive security headers
 * 
 * Features:
 * - HTTP to HTTPS redirect enforcement
 * - HSTS (HTTP Strict Transport Security)
 * - Content Security Policy (CSP)
 * - XSS Protection
 * - Frame Options
 * - Content Type Options
 * - Referrer Policy
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * HTTPS Enforcement Middleware
 * Redirects all HTTP requests to HTTPS when HTTPS is enabled
 * Supports proxy headers (X-Forwarded-Proto) for load balancers
 */
export const httpsEnforcement = (req: Request, res: Response, next: NextFunction): void => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const enableHttps = process.env.ENABLE_HTTPS === 'true';

  if (enableHttps && !isHttps) {
    logger.warn('HTTPS enforcement: redirecting HTTP request', {
      url: req.url,
      method: req.method,
      protocol: req.protocol,
      forwardedProto: req.headers['x-forwarded-proto'],
      host: req.get('host'),
      ip: req.ip,
    });

    // Redirect to HTTPS with 301 (Permanent Redirect)
    const httpsUrl = `https://${req.get('host')}${req.originalUrl}`;
    res.redirect(301, httpsUrl);
    return;
  }

  next();
};

/**
 * Security Headers Middleware
 * Configures comprehensive security headers for all responses
 * Includes HSTS, CSP, XSS Protection, and more
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';

  // HSTS (HTTP Strict Transport Security)
  // Forces browsers to use HTTPS for 1 year, includes subdomains, and allows preload
  if (isHttps) {
    const hstsMaxAge = process.env.HSTS_MAX_AGE || '31536000'; // 1 year in seconds
    res.setHeader(
      'Strict-Transport-Security',
      `max-age=${hstsMaxAge}; includeSubDomains; preload`
    );
  }

  // X-Content-Type-Options
  // Prevents MIME type sniffing attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  // Prevents clickjacking attacks by preventing page from being embedded in frames
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection
  // Enables XSS filtering in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  // Controls how much referrer information is sent with requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content-Security-Policy
  // Prevents XSS attacks by controlling which resources can be loaded
  const csp = process.env.CSP_POLICY || 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';";
  res.setHeader('Content-Security-Policy', csp);

  // Permissions-Policy (formerly Feature-Policy)
  // Controls which browser features can be used
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  );

  // X-Permitted-Cross-Domain-Policies
  // Prevents Adobe products from loading content
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  // Expect-CT (Certificate Transparency)
  // Helps detect misissued certificates
  if (isHttps) {
    res.setHeader('Expect-CT', 'max-age=86400, enforce');
  }

  // Clear-Site-Data (optional, for logout scenarios)
  // Can be set conditionally when needed
  // res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');

  next();
};

