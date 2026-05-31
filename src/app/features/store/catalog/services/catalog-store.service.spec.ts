import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { ProductStoreService } from '../../../admin/products/store/product-store.service';
import { CatalogStoreService } from './catalog-store.service';

describe('CatalogStoreService', () => {
  let productStore: {
    products: ReturnType<typeof vi.fn>;
    categories: ReturnType<typeof vi.fn>;
    productsLoadStatus: ReturnType<typeof vi.fn>;
    categoriesLoadStatus: ReturnType<typeof vi.fn>;
    productsError: ReturnType<typeof vi.fn>;
    isLoadingProducts: ReturnType<typeof vi.fn>;
    hasProducts: ReturnType<typeof vi.fn>;
    ensureProductsLoaded: ReturnType<typeof vi.fn>;
    ensureCategoriesLoaded: ReturnType<typeof vi.fn>;
    loadProducts: ReturnType<typeof vi.fn>;
    loadCategories: ReturnType<typeof vi.fn>;
    resolveProductById: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    productStore = {
      products: vi.fn(() => []),
      categories: vi.fn(() => []),
      productsLoadStatus: vi.fn(() => 'idle'),
      categoriesLoadStatus: vi.fn(() => 'idle'),
      productsError: vi.fn(() => null),
      isLoadingProducts: vi.fn(() => false),
      hasProducts: vi.fn(() => false),
      loadProducts: vi.fn(),
      loadCategories: vi.fn(),
      ensureProductsLoaded: vi.fn(),
      ensureCategoriesLoaded: vi.fn(),
      resolveProductById: vi.fn(() => of({ id: 1 })),
    };

    TestBed.configureTestingModule({
      providers: [CatalogStoreService, { provide: ProductStoreService, useValue: productStore }],
    });
  });

  it('loads products and categories when catalog is idle', () => {
    const catalog = TestBed.inject(CatalogStoreService);

    catalog.ensureCatalogLoaded();

    expect(productStore.ensureProductsLoaded).toHaveBeenCalled();
    expect(productStore.ensureCategoriesLoaded).toHaveBeenCalled();
  });

  it('filters products by search term and category independently from admin filters', () => {
    productStore.products.mockReturnValue([
      {
        id: 1,
        title: 'Blue Backpack',
        price: 10,
        description: 'Pack',
        category: 'bags',
        image: 'https://example.com/1.jpg',
      },
      {
        id: 2,
        title: 'Gold Ring',
        price: 20,
        description: 'Ring',
        category: 'jewelery',
        image: 'https://example.com/2.jpg',
      },
    ]);

    const catalog = TestBed.inject(CatalogStoreService);
    catalog.setSearchTerm('gold');
    catalog.setSelectedCategory('jewelery');

    expect(catalog.filteredProducts()).toEqual([
      {
        id: 2,
        title: 'Gold Ring',
        price: 20,
        description: 'Ring',
        category: 'jewelery',
        image: 'https://example.com/2.jpg',
      },
    ]);
  });

  it('delegates product resolution to ProductStoreService', () => {
    const catalog = TestBed.inject(CatalogStoreService);

    catalog.resolveProductById(7).subscribe();

    expect(productStore.resolveProductById).toHaveBeenCalledWith(7);
  });

  it('retries product loading through ProductStoreService', () => {
    productStore.resolveProductById.mockReturnValue(throwError(() => new Error('fail')));
    const catalog = TestBed.inject(CatalogStoreService);

    catalog.retryLoadProducts();

    expect(productStore.loadProducts).toHaveBeenCalled();
  });
});
