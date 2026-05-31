import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiProduct } from '../../../../catalog/models/product.model';
import { CatalogStoreService } from '../../services/catalog-store.service';
import { CatalogPage } from './catalog-page';

describe('CatalogPage', () => {
  const catalogMock = {
    categories: vi.fn(() => ['bags']),
    searchTerm: vi.fn(() => ''),
    selectedCategory: vi.fn(() => null),
    filteredProducts: vi.fn((): ApiProduct[] => []),
    productsError: vi.fn(() => null),
    isLoadingProducts: vi.fn(() => false),
    hasProducts: vi.fn(() => true),
    productsLoadStatus: vi.fn(() => 'success'),
    isProductsEmpty: vi.fn(() => false),
    isFilteredProductsEmpty: vi.fn(() => false),
    ensureCatalogLoaded: vi.fn(),
    retryLoadProducts: vi.fn(),
    setSearchTerm: vi.fn(),
    setSelectedCategory: vi.fn(),
    clearFilters: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CatalogPage],
      providers: [provideRouter([]), { provide: CatalogStoreService, useValue: catalogMock }],
    });
  });

  it('loads catalog data on init', () => {
    const fixture = TestBed.createComponent(CatalogPage);
    fixture.detectChanges();

    expect(catalogMock.ensureCatalogLoaded).toHaveBeenCalled();
  });

  it('renders catalog header', () => {
    catalogMock.filteredProducts.mockReturnValue([
      {
        id: 1,
        title: 'Item',
        price: 10,
        description: 'Desc',
        category: 'bags',
        image: 'https://example.com/1.jpg',
      },
    ] as ApiProduct[]);

    const fixture = TestBed.createComponent(CatalogPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Catálogo');
  });
});
