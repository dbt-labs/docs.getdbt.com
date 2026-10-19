/**
 * @jest-environment node
 */
const markdownNotFound = require('../../api/markdown-not-found');
const { NOT_FOUND_MARKDOWN } = markdownNotFound;

// Markdown 404 served to agents (api/markdown-not-found.js) for missing paths
// requested with Accept: text/markdown.
function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    end(body) {
      this.body = body;
    },
  };
}

describe('api/markdown-not-found', () => {
  it('returns a 404 with a markdown body and negotiation headers', () => {
    const res = mockResponse();
    markdownNotFound({ method: 'GET' }, res);
    expect(res.statusCode).toBe(404);
    expect(res.headers['content-type']).toBe('text/markdown; charset=utf-8');
    expect(res.headers.vary).toBe('Accept');
    expect(res.body).toBe(NOT_FOUND_MARKDOWN);
  });

  it('keeps the response out of the CDN cache', () => {
    const res = mockResponse();
    markdownNotFound({ method: 'GET' }, res);
    expect(res.headers['vercel-cdn-cache-control']).toBe('no-store');
  });

  it('sends no body for HEAD requests', () => {
    const res = mockResponse();
    markdownNotFound({ method: 'HEAD' }, res);
    expect(res.statusCode).toBe(404);
    expect(res.body).toBeUndefined();
  });

  it('explains the error and links to the docs, sitemap, and llms.txt', () => {
    expect(NOT_FOUND_MARKDOWN.startsWith('# Page not found (404)')).toBe(true);
    expect(NOT_FOUND_MARKDOWN.length).toBeGreaterThan(20);
    expect(NOT_FOUND_MARKDOWN).toContain('(https://docs.getdbt.com/docs/introduction.md)');
    expect(NOT_FOUND_MARKDOWN).toContain('(https://docs.getdbt.com/sitemap.xml)');
    expect(NOT_FOUND_MARKDOWN).toContain('(https://docs.getdbt.com/llms.txt)');
  });
});
