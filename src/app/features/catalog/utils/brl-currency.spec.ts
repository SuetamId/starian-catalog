import { describe, expect, it } from 'vitest';

import { formatBrlAmount, maskBrlInput, parseBrlAmount } from './brl-currency';

describe('brl-currency', () => {
  it('formats positive values as BRL', () => {
    expect(formatBrlAmount(109.95)).toContain('R$');
    expect(formatBrlAmount(109.95)).toContain('109,95');
  });

  it('returns empty string for invalid values', () => {
    expect(formatBrlAmount(0)).toBe('');
    expect(formatBrlAmount(Number.NaN)).toBe('');
  });

  it('parses masked currency input', () => {
    expect(parseBrlAmount('R$ 109,95')).toBe(109.95);
    expect(parseBrlAmount('10995')).toBe(109.95);
  });

  it('masks typed digits progressively', () => {
    expect(maskBrlInput('10995')).toContain('109,95');
  });
});
