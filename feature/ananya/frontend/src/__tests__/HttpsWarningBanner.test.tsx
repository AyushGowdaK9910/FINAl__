/**
 * CON-10: HTTPS Warning Banner Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HttpsWarningBanner } from '../components/https-warning-banner/HttpsWarningBanner';

describe('HttpsWarningBanner', () => {
  it('should display warning when not on HTTPS', () => {
    // Mock window.location.protocol
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http:' },
      writable: true,
    });

    render(<HttpsWarningBanner />);
    expect(screen.getByText(/not secure/i)).toBeInTheDocument();
  });

  it('should not display warning when on HTTPS', () => {
    // Mock window.location.protocol
    Object.defineProperty(window, 'location', {
      value: { protocol: 'https:' },
      writable: true,
    });

    const { container } = render(<HttpsWarningBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('should display security message', () => {
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http:' },
      writable: true,
    });

    render(<HttpsWarningBanner />);
    expect(screen.getByText(/secure connection/i)).toBeInTheDocument();
  });
});

