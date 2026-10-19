import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportCodeButton from './ReportCodeButton';

// Theme aliases aren't resolvable under jest; stub them.
jest.mock('@docusaurus/Translate', () => ({ translate: ({ message }) => message }), {
  virtual: true,
});

describe('ReportCodeButton', () => {
  it('labels the button for assistive tech', () => {
    render(<ReportCodeButton code="select 1" language="sql" />);
    expect(screen.getByRole('button', { name: 'Report incorrect code' })).toBeInTheDocument();
  });

  it('keeps the tooltip label out of the generated markdown', () => {
    const { container } = render(<ReportCodeButton code="select 1" language="sql" />);
    // rehypeCleanMarkdown drops aria-hidden elements before the HTML becomes
    // the page's .md file, so any text left after that leaks into every code block.
    container.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
    expect(container.textContent).not.toContain('Report incorrect code');
  });
});
