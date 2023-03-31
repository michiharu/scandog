import { describe, expect, test } from 'vitest';

import { getWithSuffix, isTargetPath } from './index';

describe('isTargetPath', () => {
  test('directory/name.ts', () => expect(isTargetPath('-suffix')('directory/name.ts')).toBe(true));
  test('directory/name-suffix.ts', () =>
    expect(isTargetPath('-suffix')('directory/name-suffix.ts')).toBe(false));
});

describe('getWithSuffix', () => {
  test('directory/name.ts', () =>
    expect(getWithSuffix('directory/name.ts', '-suffix')).toBe('directory/name-suffix.ts'));
});
