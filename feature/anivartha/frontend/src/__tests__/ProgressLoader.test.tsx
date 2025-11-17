/**
 * CON-8: Progress Loader Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressLoader } from '../components/progress-loader/ProgressLoader';

describe('ProgressLoader', () => {
  it('should render progress loader', () => {
    render(<ProgressLoader progress={50} message="Uploading..." />);
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
  });

  it('should display progress percentage', () => {
    render(<ProgressLoader progress={75} message="Processing..." />);
    expect(screen.getByText(/75/i)).toBeInTheDocument();
  });

  it('should show loading spinner', () => {
    const { container } = render(<ProgressLoader progress={0} message="Loading..." />);
    expect(container.querySelector('.spinner') || container.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    render(<ProgressLoader progress={100} message="Complete!" />);
    expect(screen.getByText(/complete/i)).toBeInTheDocument();
  });
});

