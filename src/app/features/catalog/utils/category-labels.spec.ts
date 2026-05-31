import { describe, expect, it } from 'vitest';

import { getCategoryLabel } from './category-labels';

describe('getCategoryLabel', () => {
  it('maps known API categories to Portuguese labels', () => {
    expect(getCategoryLabel('electronics')).toBe('Eletrônicos');
    expect(getCategoryLabel('jewelery')).toBe('Joias');
    expect(getCategoryLabel('men\'s clothing')).toBe('Roupas Masculinas');
    expect(getCategoryLabel('women\'s clothing')).toBe('Roupas Femininas');
  });

  it('returns the original value for unknown categories', () => {
    expect(getCategoryLabel('custom-category')).toBe('custom-category');
  });
});
