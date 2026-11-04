import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './index';

// Theme aliases aren't resolvable under jest; stub them.
jest.mock('@docusaurus/Link', () => ({ to, children }) => <a href={to}>{children}</a>, {
  virtual: true,
});
jest.mock('@docusaurus/useBaseUrl', () => (url) => url, { virtual: true });
jest.mock('../../utils/get-icon-type', () => () => null);
jest.mock('../borderBeam', () => () => null);
jest.mock('../lifeCycle', () => () => null);

describe('Card heading level', () => {
  it('renders the title as an h4 by default', () => {
    render(<Card title="About dbt" body="Body" link="/docs/introduction" />);
    const heading = screen.getByRole('heading', { name: 'About dbt' });
    expect(heading.tagName).toBe('H4');
    expect(heading).toHaveClass('heading-4');
  });

  it('uses the requested level and keeps the heading-4 look', () => {
    render(<Card title="About dbt" body="Body" link="/docs/introduction" headingLevel={3} />);
    const heading = screen.getByRole('heading', { level: 3, name: 'About dbt' });
    expect(heading).toHaveClass('heading-4');
  });

  it('applies the level to cards without a link', () => {
    render(<Card title="No link" body="Body" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'No link' })).toBeInTheDocument();
  });
});
