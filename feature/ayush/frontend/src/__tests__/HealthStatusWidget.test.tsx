/**
 * CON-9, CON-12: Health Status Widget Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { HealthStatusWidget } from '../components/health-status-widget/HealthStatusWidget';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('HealthStatusWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<HealthStatusWidget />);
    expect(screen.getByText(/checking health/i)).toBeInTheDocument();
  });

  it('should display health status when API returns ok', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        status: 'ok',
        uptime: 3600,
        timestamp: new Date().toISOString(),
      },
    });

    render(<HealthStatusWidget />);

    await waitFor(() => {
      expect(screen.getByText(/ok/i)).toBeInTheDocument();
    });
  });

  it('should display degraded status', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        status: 'degraded',
        uptime: 7200,
      },
    });

    render(<HealthStatusWidget />);

    await waitFor(() => {
      expect(screen.getByText(/degraded/i)).toBeInTheDocument();
    });
  });

  it('should display down status on API error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    render(<HealthStatusWidget />);

    await waitFor(() => {
      expect(screen.getByText(/down/i)).toBeInTheDocument();
    });
  });

  it('should format uptime correctly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        status: 'ok',
        uptime: 3661, // 1 hour, 1 minute, 1 second
      },
    });

    render(<HealthStatusWidget />);

    await waitFor(() => {
      expect(screen.getByText(/1h 1m/i)).toBeInTheDocument();
    });
  });
});

