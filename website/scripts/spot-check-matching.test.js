const { spotCheckMatching, sampleRandom } = require('./fetch-platform-functions');

// A tiny deterministic RNG so sampling is reproducible in tests.
function seededRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Stand-in for buildFusionIndex output: only supportedNames matters here.
const fusionIndex = {
  supportedNames: new Set(['ABS', 'LAST_DAY', 'PERCENTILE_CONT', 'STRING', 'CONCAT']),
};

describe('sampleRandom', () => {
  it('returns at most n items without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = sampleRandom(input, 3, seededRng(1));
    expect(out).toHaveLength(3);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns the whole array when n exceeds its length', () => {
    expect(sampleRandom([1, 2], 8, seededRng(1)).sort()).toEqual([1, 2]);
  });
});

describe('spotCheckMatching', () => {
  const opts = { rng: seededRng(42) };

  it('passes when Fusion functions (incl. overloaded names) are marked true', () => {
    const functions = [
      { name: 'ABS', fusion_typecheck: true },
      { name: 'CONCAT', fusion_typecheck: true },
      { name: 'LAST_DAY (Datetime)', fusion_typecheck: true },
      { name: 'STRING (Timestamp)', fusion_typecheck: true },
      { name: 'PERCENTILE_CONT (Navigation)', fusion_typecheck: true },
      { name: 'BAG_OF_WORDS', fusion_typecheck: false }, // not in Fusion — ignored
    ];
    expect(() => spotCheckMatching({ id: 'bigquery' }, functions, fusionIndex, opts)).not.toThrow();
  });

  it('throws when a Fusion function is marked false (exact-match regression)', () => {
    const functions = [
      { name: 'ABS', fusion_typecheck: false }, // ABS is in Fusion — must be true
      { name: 'CONCAT', fusion_typecheck: true },
    ];
    expect(() => spotCheckMatching({ id: 'bigquery' }, functions, fusionIndex, opts)).toThrow(/spot-check failed/);
  });

  it('throws when an overloaded name is marked false (qualifier-stripping regression)', () => {
    const functions = [
      { name: 'ABS', fusion_typecheck: true },
      { name: 'LAST_DAY (Datetime)', fusion_typecheck: false }, // base LAST_DAY is in Fusion
    ];
    expect(() => spotCheckMatching({ id: 'bigquery' }, functions, fusionIndex, opts)).toThrow(/LAST_DAY \(Datetime\)/);
  });

  it('does nothing when no Fusion index is available', () => {
    const functions = [{ name: 'ABS', fusion_typecheck: false }];
    expect(() => spotCheckMatching({ id: 'bigquery' }, functions, null, opts)).not.toThrow();
  });

  it('ignores functions Fusion does not list', () => {
    const functions = [{ name: 'BAG_OF_WORDS', fusion_typecheck: false }];
    expect(() => spotCheckMatching({ id: 'bigquery' }, functions, fusionIndex, opts)).not.toThrow();
  });
});
