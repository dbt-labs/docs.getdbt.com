import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPostCard from './index';

// Theme aliases aren't resolvable under jest; stub them.
jest.mock('@docusaurus/Link', () => ({ to, children }) => <a href={to}>{children}</a>, {
  virtual: true,
});
jest.mock('@docusaurus/useBaseUrl', () => (url) => url, { virtual: true });
jest.mock('@site/functions/post-preview', () => (text) => text, { virtual: true });

const postMetaData = {
  title: 'dbt v2.0 is GA',
  description: 'Release post',
  link: '/blog/dbt-v2-ga',
  tags: [],
};

describe('BlogPostCard heading level', () => {
  it('renders the title as an h4 by default', () => {
    render(<BlogPostCard postMetaData={postMetaData} />);
    expect(screen.getByRole('heading', { name: postMetaData.title }).tagName).toBe('H4');
  });

  it('uses the requested level and keeps the heading-4 look', () => {
    render(<BlogPostCard postMetaData={postMetaData} headingLevel={3} />);
    const heading = screen.getByRole('heading', { level: 3, name: postMetaData.title });
    expect(heading).toHaveClass('heading-4');
  });
});
