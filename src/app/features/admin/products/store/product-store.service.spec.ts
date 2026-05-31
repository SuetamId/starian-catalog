import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NormalizedHttpError } from '../../../../core/http/http-error.model';
import { ApiProduct, CreateProductPayload, UpdateProductPayload } from '../../../catalog/models/product.model';
import { ProductApiService } from '../services/product-api.service';
import { ProductStoreService } from './product-store.service';

describe('ProductStoreService', () => {
  let store: ProductStoreService;
  let productApi: {
    getProducts: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
  };

  const product: ApiProduct = {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use.',
    category: 'men\'s clothing',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  };

  const jeweleryProduct: ApiProduct = {
    id: 2,
    title: 'Gold Ring',
    price: 695,
    description: 'A beautiful gold ring.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/gold-ring.jpg',
  };

  const createPayload: CreateProductPayload = {
    title: 'New Product',
    price: 49.99,
    description: 'A newly created product.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/new-product.jpg',
  };

  const createdProduct: ApiProduct = {
    id: 3,
    ...createPayload,
  };

  const updatePayload: UpdateProductPayload = {
    title: 'Updated Backpack',
    price: 119.95,
    description: 'Updated description.',
    category: 'men\'s clothing',
    image: product.image,
  };

  const updatedProduct: ApiProduct = {
    id: product.id,
    ...updatePayload,
  };

  const normalizedError: NormalizedHttpError = {
    status: 503,
    message: 'O serviço está temporariamente indisponível. Tente novamente.',
    recoverable: true,
  };

  beforeEach(() => {
    productApi = {
      getProducts: vi.fn(),
      getCategories: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      getProductById: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ProductStoreService, { provide: ProductApiService, useValue: productApi }],
    });

    store = TestBed.inject(ProductStoreService);
  });

  it('starts with idle async state and empty collections', () => {
    expect(store.products()).toEqual([]);
    expect(store.categories()).toEqual([]);
    expect(store.productsLoadStatus()).toBe('idle');
    expect(store.categoriesLoadStatus()).toBe('idle');
    expect(store.productsError()).toBeNull();
    expect(store.categoriesError()).toBeNull();
  });

  it('loads products successfully', () => {
    productApi.getProducts.mockReturnValue(of([product]));

    store.loadProducts();

    expect(productApi.getProducts).toHaveBeenCalledTimes(1);
    expect(store.productsLoadStatus()).toBe('success');
    expect(store.products()).toEqual([product]);
    expect(store.productsError()).toBeNull();
    expect(store.isProductsEmpty()).toBe(false);
    expect(store.hasProducts()).toBe(true);
  });

  it('sets loading state while products are being fetched', () => {
    const productsSubject = new Subject<ApiProduct[]>();
    productApi.getProducts.mockReturnValue(productsSubject.asObservable());

    store.loadProducts();

    expect(store.productsLoadStatus()).toBe('loading');
    expect(store.isLoadingProducts()).toBe(true);

    productsSubject.next([product]);
    productsSubject.complete();

    expect(store.productsLoadStatus()).toBe('success');
    expect(store.isLoadingProducts()).toBe(false);
  });

  it('preserves existing products when reload fails', () => {
    productApi.getProducts
      .mockReturnValueOnce(of([product]))
      .mockReturnValueOnce(throwError(() => normalizedError));

    store.loadProducts();
    expect(store.products()).toEqual([product]);

    store.loadProducts();

    expect(store.productsLoadStatus()).toBe('error');
    expect(store.products()).toEqual([product]);
    expect(store.productsError()).toEqual(normalizedError);
  });

  it('handles product load errors with normalized errors', () => {
    productApi.getProducts.mockReturnValue(throwError(() => normalizedError));

    store.loadProducts();

    expect(store.productsLoadStatus()).toBe('error');
    expect(store.products()).toEqual([]);
    expect(store.productsError()).toEqual(normalizedError);
  });

  it('loads categories successfully', () => {
    const categories = ['electronics', 'jewelery'];

    productApi.getCategories.mockReturnValue(of(categories));

    store.loadCategories();

    expect(productApi.getCategories).toHaveBeenCalledTimes(1);
    expect(store.categoriesLoadStatus()).toBe('success');
    expect(store.categories()).toEqual(categories);
    expect(store.categoriesError()).toBeNull();
  });

  it('handles category load errors with normalized errors', () => {
    productApi.getCategories.mockReturnValue(throwError(() => normalizedError));

    store.loadCategories();

    expect(store.categoriesLoadStatus()).toBe('error');
    expect(store.categories()).toEqual([]);
    expect(store.categoriesError()).toEqual(normalizedError);
  });

  it('does not trigger duplicate product requests while loading', () => {
    const productsSubject = new Subject<ApiProduct[]>();
    productApi.getProducts.mockReturnValue(productsSubject.asObservable());

    store.loadProducts();
    store.loadProducts();

    expect(productApi.getProducts).toHaveBeenCalledTimes(1);

    productsSubject.next([product]);
    productsSubject.complete();
  });

  it('marks products as empty after a successful load with no items', () => {
    productApi.getProducts.mockReturnValue(of([]));

    store.loadProducts();

    expect(store.productsLoadStatus()).toBe('success');
    expect(store.isProductsEmpty()).toBe(true);
    expect(store.hasProducts()).toBe(false);
  });

  it('loads products only once on ensureProductsLoaded after initial success', async () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.createProduct.mockReturnValue(of(createdProduct));

    store.ensureProductsLoaded();
    expect(productApi.getProducts).toHaveBeenCalledTimes(1);

    await firstValueFrom(store.createProduct(createPayload));
    store.ensureProductsLoaded();

    expect(productApi.getProducts).toHaveBeenCalledTimes(1);
    expect(store.products()).toEqual([product, createdProduct]);
  });

  it('loads products on ensureProductsLoaded when state is idle', () => {
    productApi.getProducts.mockReturnValue(of([product]));

    store.ensureProductsLoaded();

    expect(productApi.getProducts).toHaveBeenCalledTimes(1);
    expect(store.products()).toEqual([product]);
  });

  it('does not reload products on ensureProductsLoaded after a reload error with cached data', () => {
    productApi.getProducts
      .mockReturnValueOnce(of([product]))
      .mockReturnValueOnce(throwError(() => normalizedError));

    store.loadProducts();
    store.loadProducts();

    expect(store.products()).toEqual([product]);
    productApi.getProducts.mockClear();

    store.ensureProductsLoaded();

    expect(productApi.getProducts).not.toHaveBeenCalled();
  });

  it('starts with no active filters', () => {
    expect(store.searchTerm()).toBe('');
    expect(store.selectedCategory()).toBeNull();
    expect(store.hasActiveFilters()).toBe(false);
  });

  it('trims search term when setting it', () => {
    store.setSearchTerm('  backpack  ');

    expect(store.searchTerm()).toBe('backpack');
  });

  it('filters products by title case-insensitively', () => {
    productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));

    store.loadProducts();
    store.setSearchTerm('GOLD');

    expect(store.filteredProducts()).toEqual([jeweleryProduct]);
    expect(store.products()).toHaveLength(2);
  });

  it('filters products by selected category', () => {
    productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));

    store.loadProducts();
    store.setSelectedCategory('jewelery');

    expect(store.filteredProducts()).toEqual([jeweleryProduct]);
  });

  it('combines search term and category filters', () => {
    productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));

    store.loadProducts();
    store.setSearchTerm('backpack');
    store.setSelectedCategory('men\'s clothing');

    expect(store.filteredProducts()).toEqual([product]);
  });

  it('treats empty category as null', () => {
    store.setSelectedCategory('');

    expect(store.selectedCategory()).toBeNull();
  });

  it('clears search term and selected category', () => {
    store.setSearchTerm('ring');
    store.setSelectedCategory('jewelery');

    store.clearFilters();

    expect(store.searchTerm()).toBe('');
    expect(store.selectedCategory()).toBeNull();
    expect(store.hasActiveFilters()).toBe(false);
  });

  it('marks filtered products as empty when filters exclude all items', () => {
    productApi.getProducts.mockReturnValue(of([product]));

    store.loadProducts();
    store.setSearchTerm('inexistente');

    expect(store.isProductsEmpty()).toBe(false);
    expect(store.isFilteredProductsEmpty()).toBe(true);
  });

  it('keeps isProductsEmpty true when API returns an empty list', () => {
    productApi.getProducts.mockReturnValue(of([]));

    store.loadProducts();

    expect(store.isProductsEmpty()).toBe(true);
    expect(store.isFilteredProductsEmpty()).toBe(false);
  });

  describe('createProduct()', () => {
    it('sets loading state and clears previous error', () => {
      store.clearCreateError();
      productApi.createProduct.mockReturnValue(new Subject<ApiProduct>().asObservable());

      store.createProduct(createPayload).subscribe();

      expect(store.createStatus()).toBe('loading');
      expect(store.isCreating()).toBe(true);
      expect(store.createError()).toBeNull();
    });

    it('adds the returned product to local state and preserves existing products', async () => {
      productApi.getProducts.mockReturnValue(of([product]));
      productApi.createProduct.mockReturnValue(of(createdProduct));

      store.loadProducts();
      await firstValueFrom(store.createProduct(createPayload));

      expect(store.createStatus()).toBe('success');
      expect(store.products()).toEqual([product, createdProduct]);
    });

    it('preserves the previous list and stores normalized error on failure', async () => {
      productApi.getProducts.mockReturnValue(of([product]));
      productApi.createProduct.mockReturnValue(throwError(() => normalizedError));

      store.loadProducts();

      await expect(firstValueFrom(store.createProduct(createPayload))).rejects.toEqual(
        normalizedError,
      );

      expect(store.createStatus()).toBe('error');
      expect(store.products()).toEqual([product]);
      expect(store.createError()).toEqual(normalizedError);
    });

    it('clears previous error before a new attempt', async () => {
      productApi.createProduct
        .mockReturnValueOnce(throwError(() => normalizedError))
        .mockReturnValueOnce(of(createdProduct));

      await expect(firstValueFrom(store.createProduct(createPayload))).rejects.toEqual(
        normalizedError,
      );
      expect(store.createError()).toEqual(normalizedError);

      await firstValueFrom(store.createProduct(createPayload));

      expect(store.createError()).toBeNull();
      expect(store.createStatus()).toBe('success');
    });

    it('blocks duplicate create requests while loading', () => {
      const createSubject = new Subject<ApiProduct>();
      productApi.createProduct.mockReturnValue(createSubject.asObservable());

      store.createProduct(createPayload).subscribe();
      store.createProduct(createPayload).subscribe();

      expect(productApi.createProduct).toHaveBeenCalledTimes(1);

      createSubject.next(createdProduct);
      createSubject.complete();
    });
  });

  describe('updateProduct()', () => {
    it('sets loading state, updatingProductId and clears previous error', () => {
      productApi.updateProduct.mockReturnValue(new Subject<ApiProduct>().asObservable());

      store.updateProduct(product.id, updatePayload).subscribe();

      expect(store.updateStatus()).toBe('loading');
      expect(store.isUpdating()).toBe(true);
      expect(store.updatingProductId()).toBe(product.id);
      expect(store.updateError()).toBeNull();
    });

    it('replaces only the matching product and preserves the others', async () => {
      productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
      productApi.updateProduct.mockReturnValue(of(updatedProduct));

      store.loadProducts();
      await firstValueFrom(store.updateProduct(product.id, updatePayload));

      expect(store.updateStatus()).toBe('success');
      expect(store.updatingProductId()).toBeNull();
      expect(store.products()).toEqual([updatedProduct, jeweleryProduct]);
    });

    it('preserves the previous list and stores normalized error on failure', async () => {
      productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
      productApi.updateProduct.mockReturnValue(throwError(() => normalizedError));

      store.loadProducts();

      await expect(firstValueFrom(store.updateProduct(product.id, updatePayload))).rejects.toEqual(
        normalizedError,
      );

      expect(store.updateStatus()).toBe('error');
      expect(store.updatingProductId()).toBeNull();
      expect(store.products()).toEqual([product, jeweleryProduct]);
      expect(store.updateError()).toEqual(normalizedError);
    });

    it('blocks duplicate update requests while loading', () => {
      const updateSubject = new Subject<ApiProduct>();
      productApi.updateProduct.mockReturnValue(updateSubject.asObservable());

      store.updateProduct(product.id, updatePayload).subscribe();
      store.updateProduct(product.id, updatePayload).subscribe();

      expect(productApi.updateProduct).toHaveBeenCalledTimes(1);

      updateSubject.next(updatedProduct);
      updateSubject.complete();
    });
  });

  describe('deleteProduct()', () => {
    it('sets loading state, deletingProductId and clears previous error', () => {
      productApi.deleteProduct.mockReturnValue(new Subject<void>().asObservable());

      store.deleteProduct(product.id).subscribe();

      expect(store.deleteStatus()).toBe('loading');
      expect(store.isDeleting()).toBe(true);
      expect(store.deletingProductId()).toBe(product.id);
      expect(store.deleteError()).toBeNull();
    });

    it('removes only the matching product and preserves the others', async () => {
      productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
      productApi.deleteProduct.mockReturnValue(of(undefined));

      store.loadProducts();
      await firstValueFrom(store.deleteProduct(product.id));

      expect(store.deleteStatus()).toBe('success');
      expect(store.deletingProductId()).toBeNull();
      expect(store.products()).toEqual([jeweleryProduct]);
    });

    it('preserves the previous list and stores normalized error on failure', async () => {
      productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
      productApi.deleteProduct.mockReturnValue(throwError(() => normalizedError));

      store.loadProducts();

      await expect(firstValueFrom(store.deleteProduct(product.id))).rejects.toEqual(
        normalizedError,
      );

      expect(store.deleteStatus()).toBe('error');
      expect(store.deletingProductId()).toBeNull();
      expect(store.products()).toEqual([product, jeweleryProduct]);
      expect(store.deleteError()).toEqual(normalizedError);
    });

    it('blocks duplicate delete requests while loading', () => {
      const deleteSubject = new Subject<void>();
      productApi.deleteProduct.mockReturnValue(deleteSubject.asObservable());

      store.deleteProduct(product.id).subscribe();
      store.deleteProduct(product.id).subscribe();

      expect(productApi.deleteProduct).toHaveBeenCalledTimes(1);

      deleteSubject.next(undefined);
      deleteSubject.complete();
    });
  });

  describe('filteredProducts after mutations', () => {
    it('includes a newly created product when it matches active filters', async () => {
      productApi.getProducts.mockReturnValue(of([product]));
      productApi.createProduct.mockReturnValue(of(createdProduct));

      store.loadProducts();
      store.setSearchTerm('new');
      await firstValueFrom(store.createProduct(createPayload));

      expect(store.filteredProducts()).toEqual([createdProduct]);
    });

    it('reflects an updated product in filtered results', async () => {
      productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
      productApi.updateProduct.mockReturnValue(of(updatedProduct));

      store.loadProducts();
      store.setSearchTerm('updated');
      await firstValueFrom(store.updateProduct(product.id, updatePayload));

      expect(store.filteredProducts()).toEqual([updatedProduct]);
    });

    it('removes a deleted product from filtered results', async () => {
      productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
      productApi.deleteProduct.mockReturnValue(of(undefined));

      store.loadProducts();
      store.setSelectedCategory('men\'s clothing');
      await firstValueFrom(store.deleteProduct(product.id));

      expect(store.filteredProducts()).toEqual([]);
      expect(store.products()).toEqual([jeweleryProduct]);
    });
  });

  describe('resolveProductById()', () => {
    it('returns a local product without calling the API', async () => {
      productApi.getProducts.mockReturnValue(of([product]));

      store.loadProducts();
      const resolved = await firstValueFrom(store.resolveProductById(product.id));

      expect(resolved).toEqual(product);
      expect(productApi.getProductById).not.toHaveBeenCalled();
    });

    it('fetches remotely when the product is not in local state', async () => {
      productApi.getProductById.mockReturnValue(of(product));

      const resolved = await firstValueFrom(store.resolveProductById(product.id));

      expect(productApi.getProductById).toHaveBeenCalledWith(product.id);
      expect(resolved).toEqual(product);
      expect(store.products()).toEqual([product]);
    });

    it('returns local product without fetching updated remote data', async () => {
      productApi.getProducts.mockReturnValue(of([product]));
      productApi.getProductById.mockReturnValue(of(updatedProduct));

      store.loadProducts();
      const resolved = await firstValueFrom(store.resolveProductById(product.id));

      expect(resolved).toEqual(product);
      expect(productApi.getProductById).not.toHaveBeenCalled();
      expect(store.products()).toEqual([product]);
    });

    it('preserves local products when remote resolution fails', async () => {
      productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
      productApi.getProductById.mockReturnValue(throwError(() => normalizedError));

      store.loadProducts();

      await expect(firstValueFrom(store.resolveProductById(999))).rejects.toEqual(normalizedError);
      expect(store.products()).toEqual([product, jeweleryProduct]);
    });

    it('propagates normalized errors from remote resolution', async () => {
      productApi.getProductById.mockReturnValue(throwError(() => normalizedError));

      await expect(firstValueFrom(store.resolveProductById(product.id))).rejects.toEqual(
        normalizedError,
      );
    });
  });
});
