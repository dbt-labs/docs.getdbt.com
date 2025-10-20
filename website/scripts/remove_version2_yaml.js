/*
  Remove a top-level `version: 2` line from YAML/YML fenced code blocks
  when it is the first non-empty, non-comment line in the block.

  Targets markdown files under `website/docs` and `website/snippets`.
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(ROOT, 'website', 'docs'),
  path.join(ROOT, 'website', 'snippets'),
  path.join(ROOT, 'website', 'reference'),
];

/**
 * Recursively list files with specific extensions.
 */
function listMarkdownFiles(dirPath, files = []) {
  if (!fs.existsSync(dirPath)) return files;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = listMarkdownFiles(fullPath, files);
    } else if (entry.isFile()) {
      const lower = entry.name.toLowerCase();
      if (lower.endsWith('.md') || lower.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

/**
 * Process a single markdown file: remove `version: 2` if it's the first
 * non-empty/comment line inside YAML/YML fenced code blocks.
 */
function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);

  let inFence = false;
  let fenceLanguage = '';
  let firstSignificantPending = false;
  let changed = false;

  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inFence) {
      // Detect code fence start
      if (line.startsWith('```')) {
        const afterTicks = line.slice(3).trim();
        // Determine language token (first whitespace-delimited token)
        const firstToken = afterTicks.split(/\s+/)[0]?.toLowerCase() || '';
        fenceLanguage = firstToken;
        inFence = true;
        firstSignificantPending = fenceLanguage === 'yaml' || fenceLanguage === 'yml';
        out.push(line);
        continue;
      }
      out.push(line);
      continue;
    }

    // We are inside a fenced block
    if (line.startsWith('```')) {
      // Fence end
      inFence = false;
      fenceLanguage = '';
      firstSignificantPending = false;
      out.push(line);
      continue;
    }

    if (firstSignificantPending) {
      const trimmed = line.trim();
      const isEmpty = trimmed.length === 0;
      const isComment = trimmed.startsWith('#');
      if (isEmpty || isComment) {
        // Preserve leading empties/comments
        out.push(line);
        continue;
      }

      // This is the first significant line: check for `version: 2`
      if (/^\s*version\s*:\s*2\s*$/i.test(line)) {
        // Skip writing this line to remove it
        changed = true;
        firstSignificantPending = false; // only the first significant line is special
        continue;
      }

      // Not a match; write as-is and clear the pending flag
      firstSignificantPending = false;
      out.push(line);
      continue;
    }

    // Regular line inside a fence (not the first significant YAML line)
    out.push(line);
  }

  if (changed) {
    const output = out.join('\n');
    if (output !== original) {
      fs.writeFileSync(filePath, output, 'utf8');
    }
  }
  return changed;
}

function main() {
  let totalFiles = 0;
  let changedFiles = 0;
  for (const dir of TARGET_DIRS) {
    const mdFiles = listMarkdownFiles(dir);
    totalFiles += mdFiles.length;
    for (const file of mdFiles) {
      const changed = processFile(file);
      if (changed) changedFiles++;
    }
  }
  // eslint-disable-next-line no-console
  console.log(`Processed ${totalFiles} files. Edited ${changedFiles} files.`);
}

if (require.main === module) {
  main();
}


