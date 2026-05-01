/**
 * Fetches README.md from the dbt Deployment Configuration Validator repo and writes it to
 * website/snippets/_deployment-config-validator-from-readme.md so the docs stay in sync at build time.
 *
 * Override source URL:
 *   DEPLOYMENT_CONFIG_VALIDATOR_README_URL=https://raw.githubusercontent.com/org/repo/main/README.md
 *
 * README is stripped of its top-level H1 so the docs page can own the title (same idea as MCP Tools section omitting ## Tools).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const README_URL =
  process.env.DEPLOYMENT_CONFIG_VALIDATOR_README_URL ||
  'https://raw.githubusercontent.com/patkearns10/dbt_architectural_validator/main/README.md';

const OUT_PATH = path.join(
  __dirname,
  '..',
  'snippets',
  '_deployment-config-validator-from-readme.md'
);

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

/** Drop first `# Title` line and following blank lines so the MDX page supplies H1 via frontmatter */
function stripLeadingH1(markdown) {
  const lines = markdown.split('\n');
  let i = 0;
  if (lines[i]?.startsWith('# ')) {
    i += 1;
    while (i < lines.length && lines[i].trim() === '') i += 1;
    return lines.slice(i).join('\n').trimStart();
  }
  return markdown.trimStart();
}

async function main() {
  try {
    const readme = await fetch(README_URL);
    const body = stripLeadingH1(readme);
    const timestamp = new Date().toISOString().split('T')[0];
    const content = `<!-- Auto-generated from ${README_URL}. Do not edit. Last fetched: ${timestamp} -->

${body}
`;

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, content, 'utf8');
    console.log('Wrote', OUT_PATH);
  } catch (err) {
    console.warn('fetch-deployment-config-validator-readme.js warning:', err.message);
    if (fs.existsSync(OUT_PATH)) {
      console.warn('Using previously generated snippet as fallback.');
    } else {
      console.error('No fallback snippet found — build will likely fail.');
      process.exit(1);
    }
  }
}

main();
