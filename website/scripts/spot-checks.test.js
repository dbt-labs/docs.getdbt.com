const fs = require('fs');
const path = require('path');
const { normalizeFunctionKey } = require('./fusion-match');
const { SPOT_CHECKS } = require('./fetch-platform-functions');

const DATA_DIR = path.join(__dirname, '..', 'static', 'data', 'functions');

// Guards the name/URL matching against regressions: every spot-check function
// must be present in the committed data with fusion_typecheck: true. This runs
// in normal CI (no network), so an automated data-update PR that flips one of
// these to false fails here before it can be merged.
//
// The SPOT_CHECKS lists are a frozen random sample so coverage isn't biased
// toward common math functions. To regenerate after a major data refresh, run a
// seeded shuffle over each platform's GA, fusion_typecheck: true functions
// (excluding alias-joined names containing "(", ")", "," or "$") and take the
// first 8, e.g.:
//
//   const rnd = mulberry32(20260616); // any fixed seed, for reproducibility
//   const pool = data.functions
//     .filter((f) => f.fusion_typecheck && f.preview_status === 'GA')
//     .map((f) => f.name)
//     .filter((n) => !/[(),$]/.test(n));
//   const picks = shuffle(pool, rnd).slice(0, 8).sort();
//
// then keep BigQuery's overloaded entries appended by hand.
describe('spot-check functions resolve to fusion_typecheck: true', () => {
  for (const [platform, expected] of Object.entries(SPOT_CHECKS)) {
    const dataPath = path.join(DATA_DIR, `${platform}.json`);

    // Skip platforms whose data file hasn't been generated yet.
    if (!fs.existsSync(dataPath)) continue;

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const byKey = new Map();
    for (const fn of data.functions) {
      const key = normalizeFunctionKey(fn.name);
      if (!byKey.has(key)) byKey.set(key, fn);
    }

    describe(platform, () => {
      it.each(expected)('%s is present', (name) => {
        expect(byKey.get(normalizeFunctionKey(name))).toBeDefined();
      });

      it.each(expected)('%s is marked fusion_typecheck', (name) => {
        expect(byKey.get(normalizeFunctionKey(name))?.fusion_typecheck).toBe(true);
      });
    });
  }
});
