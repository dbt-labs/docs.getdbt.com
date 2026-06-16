const fs = require('fs');
const path = require('path');
const { normalizeFunctionKey } = require('./fusion-match');
const { SPOT_CHECKS } = require('./fetch-platform-functions');

const DATA_DIR = path.join(__dirname, '..', 'static', 'data', 'functions');

// Guards the name/URL matching against regressions: every spot-check function
// must be present in the committed data with fusion_typecheck: true. This runs
// in normal CI (no network), so an automated data-update PR that flips one of
// these to false fails here before it can be merged.
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
