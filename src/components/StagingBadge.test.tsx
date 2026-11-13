import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StagingBadge } from './StagingBadge';
import { isStagingProject } from '../config/environment';

describe('StagingBadge', () => {
  it('shows the STAGING label on a staging build', () => {
    render(<StagingBadge isStaging />);
    expect(screen.getByRole('status').textContent).toBe('STAGING');
  });

  it('renders nothing on a production build', () => {
    const { container } = render(<StagingBadge isStaging={false} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('isStagingProject', () => {
  it('is true only for the staging Firebase project', () => {
    expect(isStagingProject('english-tutor-staging')).toBe(true);
    expect(isStagingProject(' english-tutor-staging ')).toBe(true);
    expect(isStagingProject('english-tutor-il-7')).toBe(false);
    expect(isStagingProject(undefined)).toBe(false);
  });
});
