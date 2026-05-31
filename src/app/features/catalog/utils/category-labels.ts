export const CATEGORY_LABELS = {
  electronics: 'Eletrônicos',
  jewelery: 'Joias',
  "men's clothing": 'Roupas Masculinas',
  "women's clothing": 'Roupas Femininas',
} as const satisfies Record<string, string>;

export type ApiCategoryKey = keyof typeof CATEGORY_LABELS;

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category as ApiCategoryKey] ?? category;
}
