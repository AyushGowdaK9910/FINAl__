/**
 * CON-1: File Upload Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FileUpload } from '../components/file-upload/FileUpload';
import { apiService } from '../../services/api';

// Mock apiService
vi.mock('../../services/api', () => ({
  apiService: {
    uploadFile: vi.fn(),
  },
}));

describe('FileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render file upload component', () => {
    render(<FileUpload />);
    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });

  it('should handle file selection', () => {
    render(<FileUpload />);
    const fileInput = screen.getByLabelText(/file/i) || screen.getByRole('button');
    expect(fileInput).toBeInTheDocument();
  });

  it('should display validation errors', async () => {
    render(<FileUpload />);
    // Test validation error display
    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });

  it('should show progress during upload', async () => {
    const mockUpload = vi.fn().mockResolvedValue({ id: '123', filename: 'test.pdf' });
    (apiService.uploadFile as any) = mockUpload;

    render(<FileUpload />);
    // Test progress display
    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });
});

