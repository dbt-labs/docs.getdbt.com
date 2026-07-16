/**
 * Fetches the "Tools" section from the dbt-mcp GitHub README and writes it
 * to website/snippets/_mcp-tools-from-readme.md so the docs can display the
 * auto-generated tool list. Run before build (e.g. prebuild or as part of build).
 *
 * README: https://github.com/dbt-labs/dbt-mcp/blob/main/README.md
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const README_URL = 'https://raw.githubusercontent.com/dbt-labs/dbt-mcp/main/README.md';
const OUT_PATH = path.join(__dirname, '..', 'snippets', '_mcp-tools-from-readme.md');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractToolsSection(readme) {
  const lines = readme.split('\n');
  let startIndex = -1;
  let endIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## Tools')) {
      startIndex = i;
      continue;
    }
    if (startIndex >= 0 && line.match(/^##\s+/)) {
      endIndex = i;
      break;
    }
  }

  if (startIndex < 0) {
    throw new Error('Could not find "## Tools" in README');
  }

  // Omit the "## Tools" line so the doc page can own the section heading
  const contentStart = lines[startIndex].trim() === '## Tools' ? startIndex + 1 : startIndex;
  return lines.slice(contentStart, endIndex).join('\n').trim();
}

async function main() {
  try {
    const readme = await fetch(README_URL);
    const toolsSection = extractToolsSection(readme);
    const timestamp = new Date().toISOString().split('T')[0];
    const content = `<!-- Auto-generated from ${README_URL} (Tools section). Do not edit. Last fetched: ${timestamp} -->

${toolsSection}
`;

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, content, 'utf8');
    console.log('Wrote', OUT_PATH);
  } catch (err) {
    console.warn('fetch-mcp-readme-tools.js warning:', err.message);
    if (fs.existsSync(OUT_PATH)) {
      console.warn('Using previously committed snippet as fallback.');
    } else {
      console.error('No fallback snippet found — build will likely fail.');
      process.exit(1);
    }
  }
}

main();
