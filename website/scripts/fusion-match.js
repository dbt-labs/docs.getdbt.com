/**
 * Shared helpers for matching platform doc function names/URLs against
 * Fusion's functions.sdf.yml (dbt-labs/fs).
 */

const yaml = require('js-yaml');

const makeTagType = (kind) =>
  new yaml.Type('!', { kind, multi: true, resolve: () => true, construct: (d) => d });
const YAML_SCHEMA = yaml.DEFAULT_SCHEMA.extend([
  makeTagType('scalar'),
  makeTagType('mapping'),
  makeTagType('sequence'),
]);

/**
 * Normalize docs URLs for comparison (lowercase host/path/hash).
 */
function normalizeFunctionUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    parsed.hash = parsed.hash.toLowerCase();
    return parsed.href.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/**
 * Build a comparison key that tolerates the cosmetic differences between how a
 * platform's docs name a function and how Fusion's YAML names it:
 *   - a trailing parenthetical qualifier the docs add to disambiguate overloads
 *     (e.g. "LAST_DAY (Datetime)", "PERCENTILE_CONT (Navigation)", "STRING (Timestamp)")
 *     — Fusion lists these under the bare name ("last_day"), so strip it.
 *   - underscores (DATEADD ↔ date_add).
 *   - case.
 */
function normalizeFunctionKey(name) {
  return name
    .replace(/\s*\([^()]*\)\s*$/, '')
    .toUpperCase()
    .replace(/_/g, '');
}

/**
 * Fusion Redshift YAML uses TIMESTAMPZ; AWS docs use TIMESTAMPTZ.
 */
function expandPlatformAliases(platformId, supportedNames) {
  if (platformId !== 'redshift') return;
  for (const name of [...supportedNames]) {
    if (name.includes('TIMESTAMPZ') && !name.includes('TIMESTAMPTZ')) {
      supportedNames.add(name.replace(/TIMESTAMPZ/g, 'TIMESTAMPTZ'));
    }
  }
}

/**
 * Parse multi-document functions.sdf.yml into lookup indexes.
 */
function buildFusionIndex(yamlText, platformId) {
  const docs = [];
  yaml.loadAll(yamlText, (doc) => { if (doc) docs.push(doc); }, { schema: YAML_SCHEMA });

  const supportedNames = new Set();
  const linkIndex = new Map();
  const normIndex = new Map();

  for (const doc of docs) {
    const fn = doc?.function;
    if (!fn?.name || fn.name.startsWith('_')) continue;

    const upper = fn.name.toUpperCase();
    supportedNames.add(upper);

    const normKey = normalizeFunctionKey(upper);
    if (!normIndex.has(normKey)) {
      normIndex.set(normKey, fn.name);
    }

    const link = fn['cross-link'] || fn.crossLink;
    if (link) {
      linkIndex.set(normalizeFunctionUrl(link), fn.name);
    }
  }

  expandPlatformAliases(platformId, supportedNames);

  return { supportedNames, linkIndex, normIndex };
}

/**
 * Whether a scraped function is already in Fusion's typechecking list.
 *
 * @param {{ name: string, docs_url?: string }} fn
 * @param {string} platformId
 * @param {{ supportedNames: Set<string>, linkIndex: Map<string, string>, normIndex: Map<string, string> }} index
 */
function isFunctionSupported(fn, platformId, index) {
  const name = fn.name.toUpperCase();
  const { supportedNames, linkIndex, normIndex } = index;

  if (supportedNames.has(name)) return true;

  if (platformId === 'redshift') {
    const fusionSpelling = name.replace(/TIMESTAMPTZ/g, 'TIMESTAMPZ');
    if (fusionSpelling !== name && supportedNames.has(fusionSpelling)) return true;
  }

  const docsUrl = normalizeFunctionUrl(fn.docs_url);
  if (docsUrl && linkIndex.has(docsUrl)) return true;

  const normKey = normalizeFunctionKey(name);
  const fusionName = normIndex.get(normKey);
  if (fusionName && fusionName.toUpperCase() !== name) return true;

  return false;
}

module.exports = {
  YAML_SCHEMA,
  normalizeFunctionUrl,
  normalizeFunctionKey,
  expandPlatformAliases,
  buildFusionIndex,
  isFunctionSupported,
};
