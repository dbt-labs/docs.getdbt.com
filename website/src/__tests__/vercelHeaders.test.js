import fs from 'fs';
import path from 'path';

// Guards the response headers that keep docs.getdbt.com legible to agents and
// safe to cache. The `Vary: Accept` entry in particular stops a CDN from
// serving a cached HTML variant to a client that negotiated for markdown.
const vercelConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'vercel.json'), 'utf8'),
);

describe('vercel.json response headers', () => {
  const globalRule = vercelConfig.headers.find((h) => h.source === '/(.*)');

  it('applies a global header rule to every path', () => {
    expect(globalRule).toBeDefined();
  });

  it('sets Vary: Accept, Accept-Encoding on all responses', () => {
    const vary = globalRule.headers.find((h) => h.key === 'Vary');
    expect(vary).toBeDefined();
    expect(vary.value).toBe('Accept, Accept-Encoding');
  });
});

describe('vercel.json markdown 404 rewrite', () => {
  const rewrite = (vercelConfig.rewrites || []).find(
    (r) => r.destination === '/api/markdown-not-found',
  );

  it('routes markdown requests for missing paths to the markdown 404 function', () => {
    expect(rewrite).toBeDefined();
    // Vercel checks the filesystem before rewrites, so a catch-all source
    // only fires for paths with no matching page or file.
    expect(rewrite.source).toBe('/(.*)');
    expect(fs.existsSync(path.join(__dirname, '..', '..', 'api', 'markdown-not-found.js'))).toBe(true);
  });

  it('only applies when the client asks for text/markdown', () => {
    expect(rewrite.has).toHaveLength(1);
    const [condition] = rewrite.has;
    expect(condition.type).toBe('header');
    expect(condition.key).toBe('accept');
    const matcher = new RegExp(`^${condition.value}$`);
    expect(matcher.test('text/markdown')).toBe(true);
    expect(matcher.test('text/markdown, text/html;q=0.9')).toBe(true);
    expect(matcher.test('text/html,application/xhtml+xml,*/*;q=0.8')).toBe(false);
  });
});
