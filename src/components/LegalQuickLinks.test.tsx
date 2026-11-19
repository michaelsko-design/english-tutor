import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ACCESSIBILITY_PAGE_PATH, CANCEL_PAGE_PATH } from '../config/appInfo';
import { LegalQuickLinks } from './LegalQuickLinks';

describe('LegalQuickLinks', () => {
  it('links to the cancellation section and the accessibility statement once the legal pages are live', () => {
    render(<LegalQuickLinks isLive />);
    const cancel = screen.getByRole('link', { name: 'ביטול עסקה' });
    expect(cancel).toHaveAttribute('href', CANCEL_PAGE_PATH);
    expect(cancel).toHaveAttribute('rel', 'noopener');
    expect(screen.getByRole('link', { name: 'הצהרת נגישות' })).toHaveAttribute('href', ACCESSIBILITY_PAGE_PATH);
  });

  it('shows nothing while the legal pages are drafts', () => {
    const { container } = render(<LegalQuickLinks isLive={false} />);
    expect(container).toBeEmptyDOMElement();
  });
});
