#!/usr/bin/env node
/**
 * Lint the docs content for mistakes that fail silently at build time.
 *
 * Several MDX components render nothing when given bad input instead of
 * raising an error, so a typo quietly deletes text from the published page
 * and nothing in the build catches it:
 *   - <Constant name="..."> returns null for an unknown name.
 *   - <Term id="..."> returns null for an unknown id.
 *   - A component left inside a code fence is never processed by MDX.
 * Other classes of mistake mangle a page without failing the build: an
 * unclosed code fence swallows the rest of the file, a dead versionedPages
 * entry silences a version gate, a missing /img/ file renders a broken image.
 *
 * This script turns all of those into a CI failure. It walks website/docs,
 * website/snippets and website/blog once, parses code fences once, and runs a
 * set of small rule functions over the result. Errors exit 1; warnings are
 * printed but never fail the build.
 *
 * Usage: node scripts/lint-docs.js
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { CONSTANTS } = require('../constants.js');
const dbtVersions = require('../dbt-versions.js');

const websiteDir = path.resolve(__dirname, '..');
const docsDir = path.join(websiteDir, 'docs');
const staticDir = path.join(websiteDir, 'static');
const SCAN_DIRS = ['docs', 'snippets', 'blog'];

// Attribute matchers reused across the component rules.
const CONSTANT_RE = /<Constant\b([^>]*?)\/?>/g;
const TERM_RE = /<Term\b([^>]*?)\/?>/g;
const LIFECYCLE_RE = /<Lifecycle\b([^>]*?)\/?>/g;
const NAME_RE = /\bname\s*=\s*["']([^"']+)["']/;
const ID_RE = /\bid\s*=\s*["']([^"']+)["']/;
const STATUS_RE = /\bstatus\s*=\s*["']([^"']+)["']/;

// Components MDX will not process inside a code fence (rule: components-in-fences).
const COMPONENT_TAG_RE =
  /<(Constant|Term|VersionBlock|File|Snippet|Lifecycle|Lightbox|Tabs|TabItem|FAQ|Expandable|Collapsible|WHCode|Card)\b/g;

// Enum sources, kept in sync with the components that consume them.
// src/components/availability/availabilityPresets.js
const AVAILABILITY_PRESETS = new Set([
  'all_users', 'platform_login', 'local_free', 'local_all', 'everywhere_usage',
]);
const AVAILABILITY_FACETS = {
  preset: AVAILABILITY_PRESETS,
  engine: new Set(['v1', 'v2']),
  surface: new Set(['local', 'local_development', 'platform']),
  access: new Set(['free', 'login_required', 'usage_based', 'paid_plan']),
  minPlan: new Set(['starter', 'enterprise', 'enterprise_plus']),
  plans: new Set(['starter', 'enterprise', 'enterprise_plus']),
};
// src/components/lifeCycle/index.js: status family is case-sensitive, plan
// family accepts either case (PLAN_VARIABLES maps both).
const LIFECYCLE_STATUS = new Set(['new', 'beta', 'private_beta', 'ga', 'preview', 'private_preview']);
const LIFECYCLE_PLANS = new Set(['developer', 'self_service', 'managed', 'managed_plus']);

const violations = [];
function report(level, file, line, rule, message) {
  violations.push({ level, file, line, rule, message });
}
const error = (file, line, rule, message) => report('error', file, line, rule, message);
const warn = (file, line, rule, message) => report('warn', file, line, rule, message);

function collectMarkdownFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectMarkdownFiles(full));
    } else if (/\.mdx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function lineOf(content, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (content[i] === '\n') line += 1;
  }
  return line;
}

/**
 * Line-based code-fence scanner following the CommonMark rules that matter for
 * these docs. Returns closed and unclosed fence regions plus lines that look
 * like a fence but are actually a broken single-line fence.
 *
 * - A fence opens on a run of 3+ backticks or tildes (any indent -- fences are
 *   nested in list items and tabs here, indented with spaces or a literal tab).
 * - It closes on the same character with a run at least as long, so a 4-backtick
 *   fence can legitimately contain ``` examples.
 * - A backtick opener whose line contains a later backtick is not a valid fence
 *   (info strings cannot contain backticks) -- that is the ```...``` on one line
 *   that should have been inline code.
 */
function parseFences(content) {
  const lines = content.split('\n');
  const fences = [];
  const invalidSingleLine = [];
  let open = null;
  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1;
    const line = lines[i];
    if (open) {
      const close = line.match(/^[ \t]*(`{3,}|~{3,})\s*$/);
      if (close && close[1][0] === open.char && close[1].length >= open.len) {
        open.closeLine = lineNo;
        fences.push(open);
        open = null;
      }
      continue;
    }
    const openMatch = line.match(/^([ \t]*)(`{3,}|~{3,})(.*)$/);
    if (!openMatch) continue;
    const marker = openMatch[2];
    const char = marker[0];
    const rest = openMatch[3];
    if (char === '`' && rest.includes('`')) {
      invalidSingleLine.push({ line: lineNo, text: line.trim() });
      continue;
    }
    open = { char, len: marker.length, openLine: lineNo, closeLine: null, unclosed: false };
  }
  if (open) {
    open.unclosed = true;
    fences.push(open);
  }
  return { lines, fences, invalidSingleLine };
}

/**
 * Blank out fenced code and inline code spans, preserving every newline so
 * reported line numbers stay exact. Fence regions come from parseFences so the
 * blanking and the structural rules share one notion of where code is.
 */
function blankCode(lines, fences) {
  const out = lines.slice();
  const blankLine = (s) => s.replace(/[^\n]/g, ' ');
  for (const fence of fences) {
    const end = fence.closeLine == null ? out.length : fence.closeLine;
    for (let ln = fence.openLine; ln <= end; ln++) {
      out[ln - 1] = blankLine(out[ln - 1]);
    }
  }
  return out.join('\n').replace(/`[^`\n]*`/g, (m) => m.replace(/[^\n]/g, ' '));
}

/** docId for a file under website/docs: path relative to docs/, no extension. */
function docIdOf(file) {
  return path.relative(docsDir, file).replace(/\.mdx?$/, '').split(path.sep).join('/');
}

// Rule 1: unbalanced or single-line code fences.
function ruleFenceBalance(relFile, fences, invalidSingleLine) {
  for (const fence of fences) {
    if (fence.unclosed) {
      error(relFile, fence.openLine, 'fence-balance',
        `code fence opened with ${fence.char.repeat(fence.len)} is never closed (swallows the rest of the page)`);
    }
  }
  for (const bad of invalidSingleLine) {
    error(relFile, bad.line, 'fence-balance',
      'triple-backtick opens and closes on one line -- use single-backtick inline code');
  }
}

// Rule 2: <Term id="..."> ids that are not defined in hover-terms.md.
function ruleTerms(relFile, blanked, validTermIds) {
  for (const match of blanked.matchAll(TERM_RE)) {
    const line = lineOf(blanked, match.index);
    const idMatch = match[1].match(ID_RE);
    if (!idMatch) {
      error(relFile, line, 'term-id', '<Term> without a literal id attribute');
    } else if (!validTermIds.has(idMatch[1])) {
      error(relFile, line, 'term-id',
        `unknown term id "${idMatch[1]}" (renders as nothing; ids are case-sensitive keys of docs/terms/hover-terms.md)`);
    }
  }
}

// Rule 3: components stranded inside a code fence (MDX never processes them).
function ruleComponentsInFences(relFile, lines, fences) {
  for (const fence of fences) {
    const bodyEnd = fence.closeLine == null ? lines.length : fence.closeLine - 1;
    for (let ln = fence.openLine + 1; ln <= bodyEnd; ln++) {
      const text = lines[ln - 1];
      COMPONENT_TAG_RE.lastIndex = 0;
      let m;
      while ((m = COMPONENT_TAG_RE.exec(text)) !== null) {
        error(relFile, ln, 'component-in-fence',
          `<${m[1]}> inside a code fence renders literally instead of being processed`);
      }
    }
  }
}

// Rule 4: constants in frontmatter or Card props (repo rule forbids both).
function ruleConstantContext(relFile, blanked) {
  const frontmatter = blanked.match(/^---\n[\s\S]*?\n---/);
  if (frontmatter && /<Constant\b/.test(frontmatter[0])) {
    const idx = frontmatter[0].search(/<Constant\b/);
    error(relFile, lineOf(blanked, idx), 'constant-context',
      '<Constant> in frontmatter -- frontmatter is not processed by MDX');
  }
  for (const card of blanked.matchAll(/<Card\b[\s\S]*?\/?>/g)) {
    const rel = card[0].search(/<Constant\b/);
    if (rel !== -1) {
      error(relFile, lineOf(blanked, card.index + rel), 'constant-context',
        '<Constant> inside <Card> props -- Card props are not processed by MDX');
    }
  }
}

// Folded-in constants rule: <Constant name="..."> against constants.js.
function ruleConstants(relFile, blanked) {
  for (const match of blanked.matchAll(CONSTANT_RE)) {
    const line = lineOf(blanked, match.index);
    const nameMatch = match[1].match(NAME_RE);
    if (!nameMatch) {
      error(relFile, line, 'constant-name', '<Constant> without a literal name attribute');
    } else if (!(nameMatch[1] in CONSTANTS)) {
      error(relFile, line, 'constant-name',
        `unknown constant "${nameMatch[1]}" (renders as nothing; valid names are the keys of constants.js)`);
    }
  }
}

// Rule 6: availability frontmatter values, plus a light drift check.
function ruleAvailability(relFile, file, data, versionedByPage) {
  const availability = data && data.availability;
  if (availability == null) return;
  let engine = null;
  if (typeof availability === 'string') {
    // index.js reads a bare string as a surface name, otherwise a preset name.
    if (!AVAILABILITY_PRESETS.has(availability) && !AVAILABILITY_FACETS.surface.has(availability)) {
      error(relFile, 1, 'availability',
        `unknown availability "${availability}" (expected a preset or surface name)`);
    }
  } else if (typeof availability === 'object') {
    for (const [facet, value] of Object.entries(availability)) {
      const allowed = AVAILABILITY_FACETS[facet];
      if (!allowed) {
        warn(relFile, 1, 'availability', `unknown availability facet "${facet}"`);
        continue;
      }
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        if (!allowed.has(v)) {
          error(relFile, 1, 'availability', `invalid availability ${facet} value "${v}"`);
        }
      }
    }
    engine = availability.engine || null;
  }
  // Drift: only flag a direct contradiction between the engine badge and an
  // explicit version gate in dbt-versions.js. An ungated v2 page is fine.
  if (engine && file.startsWith(docsDir)) {
    const entry = versionedByPage.get(docIdOf(file));
    if (entry && engine === 'v2' && entry.lastVersion) {
      warn(relFile, 1, 'availability',
        `availability engine v2 but dbt-versions.js gates the page to lastVersion ${entry.lastVersion} (Core only)`);
    }
    if (entry && engine === 'v1' && entry.firstVersion === '2.0') {
      warn(relFile, 1, 'availability',
        'availability engine v1 but dbt-versions.js gates the page firstVersion 2.0');
    }
  }
}

// Rule 7: /img/ references that do not resolve under website/static.
function ruleImages(relFile, blanked) {
  for (const match of blanked.matchAll(/\/img\/[A-Za-z0-9._/-]+\.[A-Za-z0-9]+/g)) {
    const rel = match[0].replace(/^\//, '');
    if (!fs.existsSync(path.join(staticDir, rel))) {
      error(relFile, lineOf(blanked, match.index), 'image-path',
        `image ${match[0]} not found under website/static`);
    }
  }
}

// Rule 8 (warn): content images with an empty alt attribute.
function ruleEmptyAlt(relFile, blanked) {
  for (const match of blanked.matchAll(/!\[\s*\]\([^)]*\)/g)) {
    warn(relFile, lineOf(blanked, match.index), 'empty-alt', 'image has an empty alt attribute');
  }
}

// Rule 9: <Lifecycle status="..."> tokens against the component's known values.
function ruleLifecycle(relFile, blanked) {
  for (const match of blanked.matchAll(LIFECYCLE_RE)) {
    const line = lineOf(blanked, match.index);
    const statusMatch = match[1].match(STATUS_RE);
    if (!statusMatch) {
      // No status renders nothing at all (index.js returns null) -- a silent drop.
      error(relFile, line, 'lifecycle', '<Lifecycle> without a literal status attribute');
      continue;
    }
    // An unknown token renders a plain grey pill with the literal text rather
    // than vanishing, so it is a styling/link degradation, not a silent loss.
    for (const raw of statusMatch[1].split(',')) {
      const token = raw.trim();
      if (!token) continue;
      if (!LIFECYCLE_STATUS.has(token) && !LIFECYCLE_PLANS.has(token.toLowerCase())) {
        warn(relFile, line, 'lifecycle', `unrecognised Lifecycle status "${token}" (renders as a plain grey pill)`);
      }
    }
  }
}

// Rule 5: versionedPages/versionedCategories resolve to real pages/categories.
function collectSidebarLabels() {
  const labels = new Set();
  let sidebars;
  try {
    sidebars = require('../sidebars.js');
  } catch (e) {
    return null; // best-effort: skip category validation if it will not load
  }
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      if (typeof node.label === 'string') labels.add(node.label);
      Object.values(node).forEach(walk);
    }
  };
  walk(sidebars);
  return labels;
}

function ruleVersionedPages() {
  const raw = fs.readFileSync(path.join(websiteDir, 'dbt-versions.js'), 'utf8');
  const rawLines = raw.split('\n');
  const lineForPage = (needle) => {
    const idx = rawLines.findIndex((l) => l.includes(needle));
    return idx === -1 ? 1 : idx + 1;
  };
  const resolves = (page) => {
    const base = path.join(docsDir, page);
    return ['.md', '.mdx']
      .flatMap((ext) => [base + ext, path.join(base, 'index' + ext)])
      .some((candidate) => fs.existsSync(candidate));
  };
  for (const entry of dbtVersions.versionedPages || []) {
    if (entry.page && !resolves(entry.page)) {
      error('dbt-versions.js', lineForPage(`"${entry.page}"`), 'versioned-page',
        `versionedPages entry "${entry.page}" does not resolve to a doc under website/docs`);
    }
  }
  const sidebarLabels = collectSidebarLabels();
  if (sidebarLabels) {
    for (const entry of dbtVersions.versionedCategories || []) {
      if (entry.category && !sidebarLabels.has(entry.category)) {
        warn('dbt-versions.js', lineForPage(`"${entry.category}"`), 'versioned-category',
          `versionedCategories entry "${entry.category}" matches no category label in sidebars.js`);
      }
    }
  }
}

function main() {
  const validTermIds = new Set(
    Object.keys(matter(fs.readFileSync(path.join(docsDir, 'terms/hover-terms.md'), 'utf8')).data),
  );
  const versionedByPage = new Map(
    (dbtVersions.versionedPages || []).filter((e) => e.page).map((e) => [e.page, e]),
  );

  let filesScanned = 0;
  for (const dirName of SCAN_DIRS) {
    const dir = path.join(websiteDir, dirName);
    if (!fs.existsSync(dir)) continue;
    for (const file of collectMarkdownFiles(dir)) {
      filesScanned += 1;
      const relFile = path.relative(websiteDir, file);
      const raw = fs.readFileSync(file, 'utf8');
      const { lines, fences, invalidSingleLine } = parseFences(raw);
      const blanked = blankCode(lines, fences);
      let data = {};
      try {
        data = matter(raw).data;
      } catch (e) {
        error(relFile, 1, 'frontmatter', `frontmatter does not parse: ${e.message}`);
      }

      ruleFenceBalance(relFile, fences, invalidSingleLine);
      ruleTerms(relFile, blanked, validTermIds);
      ruleComponentsInFences(relFile, lines, fences);
      ruleConstantContext(relFile, blanked);
      ruleConstants(relFile, blanked);
      ruleAvailability(relFile, file, data, versionedByPage);
      ruleImages(relFile, blanked);
      ruleEmptyAlt(relFile, blanked);
      ruleLifecycle(relFile, blanked);
    }
  }
  ruleVersionedPages();

  const errors = violations.filter((v) => v.level === 'error');
  const warnings = violations.filter((v) => v.level === 'warn');
  const byLocation = (a, b) => (a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file));
  const format = (v) => `  ${v.file}:${v.line}  [${v.rule}] ${v.message}`;

  if (warnings.length > 0) {
    console.warn(`lint-docs: ${warnings.length} warning(s):\n`);
    warnings.sort(byLocation).forEach((v) => console.warn(format(v)));
    console.warn('');
  }
  if (errors.length > 0) {
    console.error(`lint-docs: ${errors.length} error(s) found:\n`);
    errors.sort(byLocation).forEach((v) => console.error(format(v)));
    console.error('\nEach of these fails silently at build time -- fix the content or the referenced source.');
    process.exit(1);
  }
  console.log(`lint-docs: OK (${filesScanned} files scanned, ${warnings.length} warning(s))`);
}

main();
