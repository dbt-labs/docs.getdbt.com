const {
  normalizeFunctionKey,
  buildFusionIndex,
  isFunctionSupported,
} = require('./fusion-match');

describe('normalizeFunctionKey', () => {
  it('strips a trailing parenthetical qualifier', () => {
    expect(normalizeFunctionKey('LAST_DAY (Datetime)')).toBe('LASTDAY');
    expect(normalizeFunctionKey('PERCENTILE_CONT (Navigation)')).toBe('PERCENTILECONT');
    expect(normalizeFunctionKey('STRING (Timestamp)')).toBe('STRING');
  });

  it('ignores underscores and case', () => {
    expect(normalizeFunctionKey('date_add')).toBe('DATEADD');
    expect(normalizeFunctionKey('DATEADD')).toBe('DATEADD');
  });

  it('leaves bare names unchanged', () => {
    expect(normalizeFunctionKey('ABS')).toBe('ABS');
  });

  it('only strips a parenthetical when it is at the end', () => {
    expect(normalizeFunctionKey('FOO (BAR) BAZ')).toBe('FOO (BAR) BAZ');
  });
});

describe('isFunctionSupported with overloaded names', () => {
  // Mimics Fusion's functions.sdf.yml: bare names, one document per overload.
  const yaml = `---
function:
  name: last_day
  section: date_functions
---
function:
  name: percentile_cont
  section: navigation_functions
---
function:
  name: string
  section: timestamp_functions
---
function:
  name: abs
  section: math_functions
`;
  const index = buildFusionIndex(yaml, 'bigquery');

  it.each([
    'LAST_DAY (Datetime)',
    'LAST_DAY (Date)',
    'PERCENTILE_CONT (Navigation)',
    'PERCENTILE_CONT (Differential Privacy)',
    'STRING (Timestamp)',
    'ABS',
  ])('matches scraped overload "%s" to its bare Fusion name', (name) => {
    expect(isFunctionSupported({ name }, 'bigquery', index)).toBe(true);
  });

  it('does not match a function Fusion has no entry for', () => {
    expect(isFunctionSupported({ name: 'BAG_OF_WORDS' }, 'bigquery', index)).toBe(false);
  });
});
