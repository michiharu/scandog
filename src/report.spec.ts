import { describe, expect, test } from 'vitest';

import { color } from './report';

describe('color', () => {
  test(`color.green`, () => expect(color.green('_GREEN_')).toBe('\u001b[32m_GREEN_\u001b[0m'));
  test(`color.red`, () => expect(color.green('_RED_')).toBe('\u001b[32m_RED_\u001b[0m'));
});
