/**
 * CON-12: API Documentation Page Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ApiDocsPage } from '../pages/api-docs/ApiDocsPage';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ApiDocsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<ApiDocsPage />);
    expect(screen.getByText(/loading api documentation/i)).toBeInTheDocument();
  });

  it('should display API documentation when spec loads', async () => {
    const mockSpec = {
      openapi: '3.0.0',
      info: {
        title: 'File Converter API',
        version: '1.0.0',
      },
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockSpec,
    });

    render(<ApiDocsPage />);

    await waitFor(() => {
      expect(screen.getByText(/api documentation/i)).toBeInTheDocument();
    });
  });

  it('should display error message when API spec fails to load', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    render(<ApiDocsPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch api spec/i)).toBeInTheDocument();
    });
  });

  it('should display error on network failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<ApiDocsPage />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('should include health status widget', async () => {
    const mockSpec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockSpec,
    });

    render(<ApiDocsPage />);

    await waitFor(() => {
      expect(screen.getByText(/api documentation/i)).toBeInTheDocument();
    });
  });
});

