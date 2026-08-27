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
