/**
 * @jest-environment node
 */
import middleware, { config, parseAccept, prefersMarkdown } from '../../middleware';

// Homepage Markdown content negotiation (middleware.js). Agents that ask for
// text/markdown on / get /index.md; browsers keep getting index.html.
describe('homepage markdown negotiation middleware', () => {
  const request = (accept) =>
    new Request('https://docs.getdbt.com/?version=2', {
      headers: accept === undefined ? {} : { accept },
    });

  it('only runs on the homepage', () => {
    expect(config.matcher).toBe('/');
  });

  it('rewrites to /index.md when markdown is requested', () => {
    const response = middleware(request('text/markdown'));
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://docs.getdbt.com/index.md',
    );
  });

  it('never rewrites paths other than the homepage', () => {
    const docPage = new Request('https://docs.getdbt.com/docs/introduction', {
      headers: { accept: 'text/markdown' },
    });
    expect(middleware(docPage)).toBeUndefined();
  });

  it.each([
    ['no Accept header', undefined],
    ['a browser Accept header', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'],
    ['plain text/html', 'text/html'],
    ['wildcards only', '*/*'],
    ['text/* only', 'text/*'],
  ])('passes through for %s', (_label, accept) => {
    expect(middleware(request(accept))).toBeUndefined();
  });
});

describe('prefersMarkdown', () => {
  it.each([
    ['text/markdown', true],
    ['text/markdown, text/html;q=0.9', true],
    ['text/markdown, */*', true],
    ['*/*, text/markdown', true],
    ['text/html;q=0.5, text/markdown;q=0.8', true],
    ['TEXT/MARKDOWN', true],
    ['text/markdown; charset=utf-8', true],
    ['text/html, text/markdown', false],
    ['text/html, text/markdown;q=0.9', false],
    ['text/markdown;q=0', false],
    ['text/markdown;q=0.5, text/html', false],
    ['application/json', false],
    ['', false],
    [null, false],
  ])('%p -> %p', (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  it('serves markdown when text/html is explicitly refused', () => {
    expect(prefersMarkdown('text/markdown;q=0.1, text/html;q=0')).toBe(true);
  });
});

describe('parseAccept', () => {
  it('parses types, q-values, and order', () => {
    expect(parseAccept('text/html;q=0.9, text/markdown')).toEqual([
      { type: 'text/html', q: 0.9, index: 0 },
      { type: 'text/markdown', q: 1, index: 1 },
    ]);
  });

  it('treats an invalid q-value as unacceptable and clamps out-of-range values', () => {
    expect(parseAccept('text/markdown;q=abc')[0].q).toBe(0);
    expect(parseAccept('text/markdown;q=5')[0].q).toBe(1);
  });
});
