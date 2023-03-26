import { describe, expect, test } from 'vitest';

import { isTargetPath } from './index';

describe('isTargetPath', () => {
  test('directory/name.ts', () => expect(isTargetPath('-suffix')('directory/name.ts')).toBe(true));
  test('directory/name-suffix.ts', () =>
    expect(isTargetPath('-suffix')('directory/name-suffix.ts')).toBe(false));
});
