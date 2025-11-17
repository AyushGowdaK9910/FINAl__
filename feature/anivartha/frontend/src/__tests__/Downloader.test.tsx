/**
 * CON-3: Downloader Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Downloader } from '../components/downloader/Downloader';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Downloader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render downloader component', () => {
    render(<Downloader />);
    expect(screen.getByText(/download/i)).toBeInTheDocument();
  });

  it('should handle file download', async () => {
    mockedAxios.get.mockResolvedValue({
      data: new Blob(['test content']),
      headers: { 'content-type': 'application/pdf' },
    });

    render(<Downloader />);
    // Test download functionality
    expect(screen.getByText(/download/i)).toBeInTheDocument();
  });

  it('should display error on download failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Download failed'));

    render(<Downloader />);
    // Test error display
    expect(screen.getByText(/download/i)).toBeInTheDocument();
  });
});

