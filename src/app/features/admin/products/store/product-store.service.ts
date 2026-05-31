import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, finalize, Observable, of, tap, throwError } from 'rxjs';

import { NormalizedHttpError, isNormalizedHttpError } from '../../../../core/http/http-error.model';
import { normalizeHttpError } from '../../../../core/http/normalize-http-error';
import {
  ApiProduct,
  CreateProductPayload,
  UpdateProductPayload,
} from '../../../catalog/models/product.model';
import { ProductApiService } from '../services/product-api.service';
import { filterProducts } from '../../../catalog/utils/filter-products';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProductStoreState {
  products: ApiProduct[];
  categories: string[];
  productsLoadStatus: RequestStatus;
  categoriesLoadStatus: RequestStatus;
  productsError: NormalizedHttpError | null;
  categoriesError: NormalizedHttpError | null;
}

const initialState: ProductStoreState = {
  products: [],
  categories: [],
  productsLoadStatus: 'idle',
  categoriesLoadStatus: 'idle',
  productsError: null,
  categoriesError: null,
};

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
  private readonly productApi = inject(ProductApiService);

  private readonly state = signal<ProductStoreState>(initialState);
  private readonly searchTermState = signal('');
  private readonly selectedCategoryState = signal<string | null>(null);
  private readonly createStatusState = signal<RequestStatus>('idle');
  private readonly updateStatusState = signal<RequestStatus>('idle');
  private readonly deleteStatusState = signal<RequestStatus>('idle');
  private readonly createErrorState = signal<NormalizedHttpError | null>(null);
  private readonly updateErrorState = signal<NormalizedHttpError | null>(null);
  private readonly deleteErrorState = signal<NormalizedHttpError | null>(null);
  private readonly updatingProductIdState = signal<number | null>(null);
  private readonly deletingProductIdState = signal<number | null>(null);

  readonly products = computed(() => this.state().products);
  readonly categories = computed(() => this.state().categories);
  readonly productsLoadStatus = computed(() => this.state().productsLoadStatus);
  readonly categoriesLoadStatus = computed(() => this.state().categoriesLoadStatus);
  readonly productsError = computed(() => this.state().productsError);
  readonly categoriesError = computed(() => this.state().categoriesError);
  readonly searchTerm = this.searchTermState.asReadonly();
  readonly selectedCategory = this.selectedCategoryState.asReadonly();
  readonly createStatus = this.createStatusState.asReadonly();
  readonly updateStatus = this.updateStatusState.asReadonly();
  readonly deleteStatus = this.deleteStatusState.asReadonly();
  readonly createError = this.createErrorState.asReadonly();
  readonly updateError = this.updateErrorState.asReadonly();
  readonly deleteError = this.deleteErrorState.asReadonly();
  readonly updatingProductId = this.updatingProductIdState.asReadonly();
  readonly deletingProductId = this.deletingProductIdState.asReadonly();

  readonly isLoadingProducts = computed(() => this.productsLoadStatus() === 'loading');
  readonly isLoadingCategories = computed(() => this.categoriesLoadStatus() === 'loading');
  readonly isCreating = computed(() => this.createStatus() === 'loading');
  readonly isUpdating = computed(() => this.updateStatus() === 'loading');
  readonly isDeleting = computed(() => this.deleteStatus() === 'loading');
  readonly hasProducts = computed(() => this.products().length > 0);
  readonly isProductsEmpty = computed(
    () => this.productsLoadStatus() === 'success' && this.products().length === 0,
  );

  readonly filteredProducts = computed(() =>
    filterProducts(this.products(), this.searchTerm(), this.selectedCategory()),
  );

  readonly hasActiveFilters = computed(
    () => this.searchTerm().length > 0 || this.selectedCategory() !== null,
  );

  readonly isFilteredProductsEmpty = computed(
    () =>
      this.productsLoadStatus() === 'success' &&
      this.products().length > 0 &&
      this.filteredProducts().length === 0,
  );

  loadProducts(): void {
    if (this.productsLoadStatus() === 'loading') {
      return;
    }

    this.patchState({
      productsLoadStatus: 'loading',
      productsError: null,
    });

    this.productApi.getProducts().subscribe({
      next: (products) => {
        this.patchState({
          products,
          productsLoadStatus: 'success',
          productsError: null,
        });
      },
      error: (error: unknown) => {
        this.patchState({
          productsLoadStatus: 'error',
          productsError: this.toNormalizedError(error),
        });
      },
    });
  }

  ensureProductsLoaded(): void {
    const status = this.productsLoadStatus();

    if (status === 'loading' || status === 'success') {
      return;
    }

    if (status === 'idle' || (status === 'error' && !this.hasProducts())) {
      this.loadProducts();
    }
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

  createProduct(payload: CreateProductPayload): Observable<ApiProduct> {
    if (this.createStatusState() === 'loading') {
      return EMPTY;
    }

    this.createStatusState.set('loading');
    this.createErrorState.set(null);

    return this.productApi.createProduct(payload).pipe(
      tap((createdProduct) => {
        const nextCategories = this.categories().includes(createdProduct.category)
          ? this.categories()
          : [...this.categories(), createdProduct.category].sort((left, right) =>
              left.localeCompare(right),
            );

        this.patchState({
          products: [...this.products(), createdProduct],
          categories: nextCategories,
        });
        this.createStatusState.set('success');
      }),
      catchError((error: unknown) => {
        const normalized = this.toNormalizedError(error);
        this.createErrorState.set(normalized);
        this.createStatusState.set('error');
        return throwError(() => normalized);
      }),
    );
  }

  updateProduct(id: number, payload: UpdateProductPayload): Observable<ApiProduct> {
    if (this.updateStatusState() === 'loading') {
      return EMPTY;
    }

    this.updateStatusState.set('loading');
    this.updatingProductIdState.set(id);
    this.updateErrorState.set(null);

    return this.productApi.updateProduct(id, payload).pipe(
      tap((updatedProduct) => {
        this.patchState({
          products: this.products().map((currentProduct) =>
            currentProduct.id === id ? updatedProduct : currentProduct,
          ),
        });
        this.updateStatusState.set('success');
      }),
      catchError((error: unknown) => {
        const normalized = this.toNormalizedError(error);
        this.updateErrorState.set(normalized);
        this.updateStatusState.set('error');
        return throwError(() => normalized);
      }),
      finalize(() => {
        this.updatingProductIdState.set(null);
      }),
    );
  }

  deleteProduct(id: number): Observable<void> {
    if (this.deleteStatusState() === 'loading') {
      return EMPTY;
    }

    this.deleteStatusState.set('loading');
    this.deletingProductIdState.set(id);
    this.deleteErrorState.set(null);

    return this.productApi.deleteProduct(id).pipe(
      tap(() => {
        this.patchState({
          products: this.products().filter((currentProduct) => currentProduct.id !== id),
        });
        this.deleteStatusState.set('success');
      }),
      catchError((error: unknown) => {
        const normalized = this.toNormalizedError(error);
        this.deleteErrorState.set(normalized);
        this.deleteStatusState.set('error');
        return throwError(() => normalized);
      }),
      finalize(() => {
        this.deletingProductIdState.set(null);
      }),
    );
  }

  clearCreateError(): void {
    this.createErrorState.set(null);
  }

  clearUpdateError(): void {
    this.updateErrorState.set(null);
  }

  clearDeleteError(): void {
    this.deleteErrorState.set(null);
  }

  resolveProductById(id: number): Observable<ApiProduct> {
    const localProduct = this.products().find((product) => product.id === id);

    if (localProduct) {
      return of(localProduct);
    }

    return this.productApi.getProductById(id).pipe(
      tap((remoteProduct) => {
        const productExists = this.products().some((product) => product.id === remoteProduct.id);

        this.patchState({
          products: productExists
            ? this.products().map((product) =>
                product.id === remoteProduct.id ? remoteProduct : product,
              )
            : [...this.products(), remoteProduct],
        });
      }),
      catchError((error: unknown) => throwError(() => this.toNormalizedError(error))),
    );
  }

  loadCategories(): void {
    if (this.categoriesLoadStatus() === 'loading') {
      return;
    }

    this.patchState({
      categoriesLoadStatus: 'loading',
      categoriesError: null,
    });

    this.productApi.getCategories().subscribe({
      next: (categories) => {
        this.patchState({
          categories,
          categoriesLoadStatus: 'success',
          categoriesError: null,
        });
      },
      error: (error: unknown) => {
        this.patchState({
          categoriesLoadStatus: 'error',
          categoriesError: this.toNormalizedError(error),
        });
      },
    });
  }

  ensureCategoriesLoaded(): void {
    const status = this.categoriesLoadStatus();

    if (status === 'loading' || status === 'success') {
      return;
    }

    if (status === 'idle' || status === 'error') {
      this.loadCategories();
    }
  }

  private patchState(partial: Partial<ProductStoreState>): void {
    this.state.update((current) => ({ ...current, ...partial }));
  }

  private toNormalizedError(error: unknown): NormalizedHttpError {
    return isNormalizedHttpError(error) ? error : normalizeHttpError(error);
  }
}
