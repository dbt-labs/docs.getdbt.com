// website/src/utils/markdown-utils.test.js
import { processVersionBlocks, stripVersionBlockTags, removeFrontmatter, useRawMarkdownContent } from './markdown-utils';
import React from 'react';
import { renderHook } from '@testing-library/react';
import VersionContext from '../stores/VersionContext';
import { usePluginData } from '@docusaurus/useGlobalData';

describe('processVersionBlocks', () => {
  describe('single block - visible', () => {
    it('keeps inner content and removes tags when version is in range', () => {
      const input = `Before\n<VersionBlock firstVersion="1.10">Inner content</VersionBlock>\nAfter`;
      const result = processVersionBlocks(input, '1.10');
      expect(result).toContain('Inner content');
      expect(result).not.toContain('<VersionBlock');
      expect(result).not.toContain('</VersionBlock>');
      expect(result).toContain('Before');
      expect(result).toContain('After');
    });

    it('keeps content when version is newer than firstVersion', () => {
      const input = `<VersionBlock firstVersion="1.10">New feature</VersionBlock>`;
      const result = processVersionBlocks(input, '1.12');
      expect(result).toContain('New feature');
      expect(result).not.toContain('<VersionBlock');
    });
  });

  describe('single block - not visible', () => {
    it('removes entire block when version is below firstVersion', () => {
      const input = `Before\n<VersionBlock firstVersion="1.10">Hidden</VersionBlock>\nAfter`;
      const result = processVersionBlocks(input, '1.9');
      expect(result).not.toContain('Hidden');
      expect(result).not.toContain('<VersionBlock');
      expect(result).toContain('Before');
      expect(result).toContain('After');
    });

    it('removes block when version is above lastVersion', () => {
      const input = `Before\n<VersionBlock firstVersion="1.8" lastVersion="1.9">Old content</VersionBlock>\nAfter`;
      const result = processVersionBlocks(input, '1.10');
      expect(result).not.toContain('Old content');
      expect(result).toContain('Before');
      expect(result).toContain('After');
    });
  });

  describe('lastVersion optional', () => {
    it('keeps block with no lastVersion when version >= firstVersion', () => {
      const input = `<VersionBlock firstVersion="1.5">Always visible from 1.5</VersionBlock>`;
      const result = processVersionBlocks(input, '1.12');
      expect(result).toContain('Always visible from 1.5');
    });
  });

  describe('lastVersion only (no firstVersion)', () => {
    it('keeps block with only lastVersion when version is within range', () => {
      const input = `<VersionBlock lastVersion="1.11">Legacy content</VersionBlock>`;
      const result = processVersionBlocks(input, '1.10');
      expect(result).toContain('Legacy content');
      expect(result).not.toContain('<VersionBlock');
    });

    it('removes block with only lastVersion when version exceeds lastVersion', () => {
      const input = `Before\n<VersionBlock lastVersion="1.11">Legacy content</VersionBlock>\nAfter`;
      const result = processVersionBlocks(input, '1.12');
      expect(result).not.toContain('Legacy content');
      expect(result).toContain('Before');
      expect(result).toContain('After');
    });
  });

  describe('multiple blocks', () => {
    it('processes each block independently', () => {
      const input = [
        '<VersionBlock firstVersion="1.10">Visible block</VersionBlock>',
        '<VersionBlock firstVersion="1.12">Hidden block</VersionBlock>',
      ].join('\n');
      const result = processVersionBlocks(input, '1.10');
      expect(result).toContain('Visible block');
      expect(result).not.toContain('Hidden block');
    });
  });

  describe('nested blocks', () => {
    it('removes inner block but keeps outer content when outer visible, inner not', () => {
      const input = `<VersionBlock firstVersion="1.8">Outer content\n<VersionBlock firstVersion="1.12">Inner content</VersionBlock>\nMore outer</VersionBlock>`;
      const result = processVersionBlocks(input, '1.10');
      expect(result).toContain('Outer content');
      expect(result).toContain('More outer');
      expect(result).not.toContain('Inner content');
      expect(result).not.toContain('<VersionBlock');
    });

    it('removes entire outer block including nested inner when outer not visible', () => {
      const input = `<VersionBlock firstVersion="1.12">Outer\n<VersionBlock firstVersion="1.9">Inner</VersionBlock></VersionBlock>`;
      const result = processVersionBlocks(input, '1.10');
      expect(result).not.toContain('Outer');
      expect(result).not.toContain('Inner');
    });
  });

  describe('edge cases', () => {
    it('returns content unchanged when version is falsy', () => {
      const input = `<VersionBlock firstVersion="1.10">Content</VersionBlock>`;
      expect(processVersionBlocks(input, null)).toBe(input);
      expect(processVersionBlocks(input, '')).toBe(input);
      expect(processVersionBlocks(input, undefined)).toBe(input);
    });

    it('returns falsy input as-is', () => {
      expect(processVersionBlocks(null, '1.10')).toBe(null);
      expect(processVersionBlocks('', '1.10')).toBe('');
      expect(processVersionBlocks(undefined, '1.10')).toBe(undefined);
    });

    it('preserves text with no version blocks', () => {
      const input = '# Title\n\nSome content without blocks.';
      expect(processVersionBlocks(input, '1.10')).toBe(input);
    });

    it('handles multiline opening tag (attributes on separate line)', () => {
      const input = `<VersionBlock\n  firstVersion="1.10"\n  lastVersion="1.12"\n>Content</VersionBlock>`;
      const result = processVersionBlocks(input, '1.10');
      expect(result).toContain('Content');
      expect(result).not.toContain('<VersionBlock');
    });

    it('handles multiline block content', () => {
      const input = `<VersionBlock firstVersion="1.10">\n\n## Section\n\nParagraph text.\n\n</VersionBlock>`;
      const result = processVersionBlocks(input, '1.10');
      expect(result).toContain('## Section');
      expect(result).toContain('Paragraph text.');
      expect(result).not.toContain('<VersionBlock');
    });

    it('returns content unchanged on malformed MDX with unclosed VersionBlock', () => {
      const input = '<VersionBlock firstVersion="1.10">Unclosed content';
      expect(processVersionBlocks(input, '1.10')).toBe(input);
    });
  });
});

const createWrapper = (version = '1.10') => ({ children }) => (
  <VersionContext.Provider value={{ version }}>
    {children}
  </VersionContext.Provider>
);

describe('useRawMarkdownContent', () => {
  beforeEach(() => {
    usePluginData.mockReturnValue({ rawMarkdownData: {}, pathByIdMap: {} });
    // Reset pathname to default for each test
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns null when version is not yet resolved', () => {
    window.history.replaceState({}, '', '/docs/build/test');
    usePluginData.mockReturnValue({
      rawMarkdownData: { 'docs/build/test.md': '<VersionBlock firstVersion="1.10">Content</VersionBlock>' },
      pathByIdMap: {},
    });
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(''),
    });
    expect(result.current).toBeNull();
  });

  it('returns null when rawMarkdownData is empty', () => {
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBeNull();
  });

  it('returns null when rawMarkdownData is missing from plugin data', () => {
    usePluginData.mockReturnValue({});
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBeNull();
  });

  it('returns content when direct .md path matches current URL', () => {
    window.history.replaceState({}, '', '/docs/build/test');
    usePluginData.mockReturnValue({
      rawMarkdownData: { 'docs/build/test.md': '# Test\n\nSome content.' },
      pathByIdMap: {},
    });
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toContain('Some content.');
  });

  it('returns content when .mdx path matches', () => {
    window.history.replaceState({}, '', '/docs/build/test');
    usePluginData.mockReturnValue({
      rawMarkdownData: { 'docs/build/test.mdx': '# Test\n\nMDX content.' },
      pathByIdMap: {},
    });
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toContain('MDX content.');
  });

  it('resolves via ID mapping when direct path has no match', () => {
    window.history.replaceState({}, '', '/docs/build/test');
    usePluginData.mockReturnValue({
      rawMarkdownData: { 'docs/build/actual-filename.md': '# Page\n\nContent via ID mapping.' },
      pathByIdMap: { 'docs/build/test.md': 'docs/build/actual-filename.md' },
    });
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toContain('Content via ID mapping.');
  });

  it('strips frontmatter and promotes title to H1', () => {
    window.history.replaceState({}, '', '/docs/build/test');
    usePluginData.mockReturnValue({
      rawMarkdownData: {
        'docs/build/test.md': '---\ntitle: My Page Title\nid: test\n---\n\nBody content here.',
      },
      pathByIdMap: {},
    });
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toContain('# My Page Title');
    expect(result.current).not.toContain('---');
    expect(result.current).toContain('Body content here.');
  });

  it('filters VersionBlock content based on the selected version', () => {
    window.history.replaceState({}, '', '/docs/build/test');
    usePluginData.mockReturnValue({
      rawMarkdownData: {
        'docs/build/test.md': [
          'Shared content',
          '<VersionBlock firstVersion="1.12">New feature only in 1.12+</VersionBlock>',
          '<VersionBlock lastVersion="1.9">Legacy feature removed in 1.10</VersionBlock>',
        ].join('\n'),
      },
      pathByIdMap: {},
    });
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper('1.10'),
    });
    expect(result.current).toContain('Shared content');
    expect(result.current).not.toContain('New feature only in 1.12+');
    expect(result.current).not.toContain('Legacy feature removed in 1.10');
  });

  it('returns null when no path matches', () => {
    window.history.replaceState({}, '', '/docs/build/test');
    usePluginData.mockReturnValue({
      rawMarkdownData: { 'docs/build/other.md': 'Other content' },
      pathByIdMap: {},
    });
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBeNull();
  });

  it('returns null and warns on error', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    // Create an object with a getter that throws when accessing rawMarkdownData
    const badPluginData = {};
    Object.defineProperty(badPluginData, 'rawMarkdownData', {
      get() {
        throw new Error('Cannot access raw markdown data');
      },
    });
    usePluginData.mockReturnValue(badPluginData);
    const { result } = renderHook(() => useRawMarkdownContent(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      'Could not access raw markdown data:',
      expect.any(Error)
    );
    warnSpy.mockRestore();
  });
});

describe('removeFrontmatter', () => {
  it('strips frontmatter and promotes title to H1', () => {
    const input = '---\ntitle: My Page\nid: my-page\n---\n\nBody content.';
    const result = removeFrontmatter(input);
    expect(result).toBe('# My Page\n\nBody content.');
  });

  it('returns content unchanged when no frontmatter present', () => {
    const input = '# Title\n\nBody.';
    expect(removeFrontmatter(input)).toBe(input);
  });

  it('returns falsy input as-is', () => {
    expect(removeFrontmatter(null)).toBe(null);
    expect(removeFrontmatter('')).toBe('');
  });
});

describe('stripVersionBlockTags', () => {
  it('removes opening and closing tags, keeps inner content', () => {
    const input = '<VersionBlock firstVersion="1.10">Some content</VersionBlock>';
    const result = stripVersionBlockTags(input);
    expect(result).toBe('Some content');
    expect(result).not.toContain('<VersionBlock');
    expect(result).not.toContain('</VersionBlock>');
  });

  it('keeps content from ALL blocks regardless of version range', () => {
    const input = [
      '<VersionBlock firstVersion="1.10">New content</VersionBlock>',
      '<VersionBlock lastVersion="1.9">Old content</VersionBlock>',
    ].join('\n');
    const result = stripVersionBlockTags(input);
    expect(result).toContain('New content');
    expect(result).toContain('Old content');
    expect(result).not.toContain('<VersionBlock');
  });

  it('handles multiline opening tags', () => {
    const input = '<VersionBlock\n  firstVersion="1.10"\n  lastVersion="1.12"\n>Content</VersionBlock>';
    const result = stripVersionBlockTags(input);
    expect(result).toBe('Content');
  });

  it('handles nested blocks — keeps all inner content', () => {
    const input = '<VersionBlock firstVersion="1.8">Outer\n<VersionBlock firstVersion="1.12">Inner</VersionBlock>\nMore</VersionBlock>';
    const result = stripVersionBlockTags(input);
    expect(result).toContain('Outer');
    expect(result).toContain('Inner');
    expect(result).toContain('More');
    expect(result).not.toContain('<VersionBlock');
  });

  it('preserves surrounding text', () => {
    const input = 'Before\n<VersionBlock firstVersion="1.10">Middle</VersionBlock>\nAfter';
    const result = stripVersionBlockTags(input);
    expect(result).toBe('Before\nMiddle\nAfter');
  });

  it('returns falsy input as-is', () => {
    expect(stripVersionBlockTags(null)).toBe(null);
    expect(stripVersionBlockTags('')).toBe('');
    expect(stripVersionBlockTags(undefined)).toBe(undefined);
  });

  it('returns content unchanged when no VersionBlock tags present', () => {
    const input = '# Title\n\nNo version blocks here.';
    expect(stripVersionBlockTags(input)).toBe(input);
  });
});
