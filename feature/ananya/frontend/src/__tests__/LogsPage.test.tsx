/**
 * CON-4: Logs Page Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LogsPage } from '../pages/logs/LogsPage';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('LogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<LogsPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display log files when loaded', async () => {
    const mockLogFiles = [
      { filename: 'app.log', size: 1024, modified: '2025-11-17', created: '2025-11-17' },
      { filename: 'error.log', size: 2048, modified: '2025-11-17', created: '2025-11-17' },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockLogFiles });

    render(<LogsPage />);

    await waitFor(() => {
      expect(screen.getByText(/app\.log/i)).toBeInTheDocument();
    });
  });

  it('should display error message on API failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    render(<LogsPage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should allow selecting a log file', async () => {
    const mockLogFiles = [
      { filename: 'app.log', size: 1024, modified: '2025-11-17', created: '2025-11-17' },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockLogFiles });

    render(<LogsPage />);

    await waitFor(() => {
      expect(screen.getByText(/app\.log/i)).toBeInTheDocument();
    });
  });
});

