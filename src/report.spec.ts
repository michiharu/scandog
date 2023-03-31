import { describe, expect, test } from 'vitest';

import { bg, color, reportArgs } from './report';

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
});
