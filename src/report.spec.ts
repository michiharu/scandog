import { describe, expect, test } from 'vitest';

import { bg, color, reportArgs, reportErrors } from './report';

describe('color', () => {
  test(`color.green`, () => expect(color.green('_GREEN_')).toBe('\u001b[32m_GREEN_\u001b[0m'));
  test(`color.red`, () => expect(color.green('_RED_')).toBe('\u001b[32m_RED_\u001b[0m'));
});

describe('bg', () => {
  test(`bg.green`, () => expect(bg.green('_GREEN_')).toBe('\u001b[42m_GREEN_\u001b[49m'));
  test(`bg.red`, () => expect(bg.green('_RED_')).toBe('\u001b[42m_RED_\u001b[49m'));
});

describe('reportArgs', () => {
  test(`basic usage`, () => {
    expect(reportArgs('.spec', ['**/*.{js,jsx,ts,tsx}'], false)).toEqual([
      'Arguments:',
      '     suffix: .spec',
      '    pattern: **/*.{js,jsx,ts,tsx}',
      '  gitignore: false',
      '',
    ]);
  });
  test(`patterns`, () => {
    expect(reportArgs('.spec', ['**/*.{js,jsx,ts,tsx}', '!*.config.ts'], false)).toEqual([
      'Arguments:',
      '     suffix: .spec',
      '   patterns:',
      '      - **/*.{js,jsx,ts,tsx}',
      '      - !*.config.ts',
      '  gitignore: false',
      '',
    ]);
  });
  test(`--gitignore`, () => {
    expect(reportArgs('.spec', ['**/*.{js,jsx,ts,tsx}'], true)).toEqual([
      'Arguments:',
      '     suffix: .spec',
      '    pattern: **/*.{js,jsx,ts,tsx}',
      '  gitignore: true',
      '',
    ]);
  });
});

describe('reportErrors', () => {
  test(`no file with suffix exist`, () => {
    expect(reportErrors([])).toEqual([]);
  });
  test(`1 file with no suffix exists`, () => {
    const results = [{ path: 'dir/name.ts', withSuffix: 'dir/name.spec.ts', exists: false }];
    expect(reportErrors(results)).toEqual([
      'Does not exist: ./dir/name.spec.ts',
      '               (./dir/name.ts)',
    ]);
  });
});
