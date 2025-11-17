/**
 * CON-4: Log Table Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LogTable } from '../components/log-table/LogTable';

const mockLogFiles = [
  { filename: 'app.log', size: 1024, modified: '2025-11-17T10:00:00Z', created: '2025-11-17T09:00:00Z' },
  { filename: 'error.log', size: 2048, modified: '2025-11-17T11:00:00Z', created: '2025-11-17T10:00:00Z' },
];

describe('LogTable', () => {
  it('should render log files table', () => {
    render(<LogTable logFiles={mockLogFiles} onSelectFile={vi.fn()} />);
    expect(screen.getByText(/app\.log/i)).toBeInTheDocument();
    expect(screen.getByText(/error\.log/i)).toBeInTheDocument();
  });

  it('should call onSelectFile when row is clicked', () => {
    const onSelectFile = vi.fn();
    render(<LogTable logFiles={mockLogFiles} onSelectFile={onSelectFile} />);
    
    const firstRow = screen.getByText(/app\.log/i).closest('tr');
    if (firstRow) {
      firstRow.click();
      expect(onSelectFile).toHaveBeenCalledWith('app.log');
    }
  });

  it('should display file sizes', () => {
    render(<LogTable logFiles={mockLogFiles} onSelectFile={vi.fn()} />);
    expect(screen.getByText(/1024/i)).toBeInTheDocument();
    expect(screen.getByText(/2048/i)).toBeInTheDocument();
  });

  it('should handle empty log files array', () => {
    render(<LogTable logFiles={[]} onSelectFile={vi.fn()} />);
    expect(screen.queryByText(/app\.log/i)).not.toBeInTheDocument();
  });
});

