import { ApiProduct } from '../models/product.model';

export function filterProducts(
  products: ApiProduct[],
  searchTerm: string,
  selectedCategory: string | null,
): ApiProduct[] {
  const term = searchTerm.trim().toLowerCase();
  const category = selectedCategory;

  return products.filter((product) => {
    const matchesTitle = !term || product.title.toLowerCase().includes(term);
    const matchesCategory = !category || product.category === category;

    return matchesTitle && matchesCategory;
  });
}
