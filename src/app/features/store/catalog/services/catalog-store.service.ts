import { computed, inject, Injectable, signal } from '@angular/core';

import { ProductStoreService } from '../../../admin/products/store/product-store.service';
import { filterProducts } from '../../../catalog/utils/filter-products';

@Injectable({ providedIn: 'root' })
export class CatalogStoreService {
  private readonly productStore = inject(ProductStoreService);

  private readonly searchTermState = signal('');
  private readonly selectedCategoryState = signal<string | null>(null);

  readonly products = this.productStore.products;
  readonly categories = this.productStore.categories;
  readonly productsLoadStatus = this.productStore.productsLoadStatus;
  readonly categoriesLoadStatus = this.productStore.categoriesLoadStatus;
  readonly productsError = this.productStore.productsError;
  readonly isLoadingProducts = this.productStore.isLoadingProducts;
  readonly hasProducts = this.productStore.hasProducts;
  readonly searchTerm = this.searchTermState.asReadonly();
  readonly selectedCategory = this.selectedCategoryState.asReadonly();

  readonly filteredProducts = computed(() =>
    filterProducts(this.products(), this.searchTerm(), this.selectedCategory()),
  );

  readonly hasActiveFilters = computed(
    () => this.searchTerm().length > 0 || this.selectedCategory() !== null,
  );

  readonly isProductsEmpty = computed(
    () => this.productsLoadStatus() === 'success' && this.products().length === 0,
  );

  readonly isFilteredProductsEmpty = computed(
    () =>
      this.productsLoadStatus() === 'success' &&
      this.products().length > 0 &&
      this.filteredProducts().length === 0,
  );

  ensureCatalogLoaded(): void {
    this.productStore.ensureProductsLoaded();
    this.productStore.ensureCategoriesLoaded();
  }

  retryLoadProducts(): void {
    this.productStore.loadProducts();
  }

  setSearchTerm(term: string): void {
    this.searchTermState.set(term.trim());
  }

  setSelectedCategory(category: string | null): void {
    const normalized = category?.trim() ?? '';

    this.selectedCategoryState.set(normalized === '' ? null : normalized);
  }

  clearFilters(): void {
    this.searchTermState.set('');
    this.selectedCategoryState.set(null);
  }

  resolveProductById(id: number) {
    return this.productStore.resolveProductById(id);
  }
}
