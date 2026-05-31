import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ConfirmDialog } from '../../../../../shared/ui/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../../../shared/ui/error-state/error-state';
import { FilteredEmptyState } from '../../../../../shared/ui/filtered-empty-state/filtered-empty-state';
import { LoadingState } from '../../../../../shared/ui/loading-state/loading-state';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { ProductFilters } from '../../../../catalog/components/product-filters/product-filters';
import { ProductCardGrid } from '../../components/product-card-grid/product-card-grid';
import { ProductList } from '../../components/product-list/product-list';
import { ApiProduct } from '../../../../catalog/models/product.model';
import { ProductStoreService } from '../../store/product-store.service';

export type ProductsViewMode = 'list' | 'grid';

@Component({
  selector: 'app-products-list-page',
  imports: [
    ConfirmDialog,
    EmptyState,
    ErrorState,
    FilteredEmptyState,
    LoadingState,
    ProductCardGrid,
    ProductFilters,
    ProductList,
    RouterLink,
  ],
  templateUrl: './products-list-page.html',
  styleUrl: './products-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);

  protected readonly store = inject(ProductStoreService);
  protected readonly selectedProductForDeletion = signal<ApiProduct | null>(null);
  protected readonly viewMode = signal<ProductsViewMode>('list');

  private readonly confirmDialog = viewChild(ConfirmDialog);

  protected readonly productsErrorMessage = computed(
    () =>
      this.store.productsError()?.message ??
      'Não foi possível carregar os produtos. Tente novamente.',
  );

  protected readonly deleteDialogMessage = computed(() => {
    const product = this.selectedProductForDeletion();

    if (!product) {
      return '';
    }

    return `Tem certeza de que deseja excluir “${product.title}”? Esta ação será refletida somente na sessão atual.`;
  });

  protected readonly showInitialLoading = computed(
    () => this.store.isLoadingProducts() && !this.store.hasProducts(),
  );

  protected readonly showInitialError = computed(
    () => this.store.productsLoadStatus() === 'error' && !this.store.hasProducts(),
  );

  protected readonly showReloadError = computed(
    () => this.store.productsLoadStatus() === 'error' && this.store.hasProducts(),
  );

  protected readonly registeredProductCount = computed(() => this.store.products().length);

  ngOnInit(): void {
    this.store.ensureProductsLoaded();
    this.store.ensureCategoriesLoaded();
  }

  setViewMode(mode: ProductsViewMode): void {
    this.viewMode.set(mode);
  }

  retryLoadProducts(): void {
    this.store.loadProducts();
  }

  onDeleteRequested(product: ApiProduct): void {
    this.store.clearDeleteError();
    this.selectedProductForDeletion.set(product);
    this.confirmDialog()?.open();
  }

  onDeleteConfirmed(): void {
    const product = this.selectedProductForDeletion();

    if (!product) {
      return;
    }

    this.store
      .deleteProduct(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.showSuccess('Produto excluído com sucesso.');
          this.confirmDialog()?.close();
          this.selectedProductForDeletion.set(null);
        },
        error: () => {
          this.toast.showError('Não foi possível excluir o produto.');
        },
      });
  }

  onDeleteCancelled(): void {
    this.confirmDialog()?.close();
    this.selectedProductForDeletion.set(null);
    this.store.clearDeleteError();
  }
}
