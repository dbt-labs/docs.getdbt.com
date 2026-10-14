import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFoundContent from './index';

// The theme aliases (@docusaurus/*, @theme/*) aren't resolvable under jest,
// so stub them with minimal DOM-equivalent implementations.
jest.mock(
  '@docusaurus/Link',
  () => ({ to, children }) => <a href={to}>{children}</a>,
  { virtual: true },
);
jest.mock('@docusaurus/Translate', () => ({ children }) => <>{children}</>, {
  virtual: true,
});
jest.mock(
  '@theme/Heading',
  () => ({ as: As = 'h1', children, ...rest }) => <As {...rest}>{children}</As>,
  { virtual: true },
);

describe('NotFound/Content (404 page)', () => {
  it('renders a single h1', () => {
    render(<NotFoundContent />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/page not found/i);
  });

  it('gives agents recovery links to the docs index, sitemap, and llms.txt', () => {
    render(<NotFoundContent />);
    expect(screen.getByRole('link', { name: /docs home/i })).toHaveAttribute(
      'href',
      '/docs/introduction',
    );
    expect(
      screen.getByRole('link', { name: /sitemap \(sitemap\.xml\)/i }),
    ).toHaveAttribute('href', '/sitemap.xml');
    expect(screen.getByRole('link', { name: /^llms\.txt$/i })).toHaveAttribute(
      'href',
      '/llms.txt',
    );
    expect(
      screen.getByRole('link', { name: /llms-full\.txt/i }),
    ).toHaveAttribute('href', '/llms-full.txt');
  });

  it('renders enough body text for a crawler to parse (500+ chars)', () => {
    const { container } = render(<NotFoundContent />);
    expect(container.textContent.trim().length).toBeGreaterThan(500);
  });
});
