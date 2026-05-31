import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';

import { EmptyState } from '../../../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../../../shared/ui/error-state/error-state';
import { FilteredEmptyState } from '../../../../../shared/ui/filtered-empty-state/filtered-empty-state';
import { LoadingState } from '../../../../../shared/ui/loading-state/loading-state';
import { ProductFilters } from '../../../../catalog/components/product-filters/product-filters';
import { StoreProductGrid } from '../../../components/store-product-grid/store-product-grid';
import { CatalogStoreService } from '../../services/catalog-store.service';

@Component({
  selector: 'app-catalog-page',
  imports: [EmptyState, ErrorState, FilteredEmptyState, LoadingState, ProductFilters, StoreProductGrid],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPage implements OnInit {
  protected readonly catalog = inject(CatalogStoreService);

  protected readonly productsErrorMessage = computed(
    () =>
      this.catalog.productsError()?.message ??
      'Não foi possível carregar o catálogo. Tente novamente.',
  );

  protected readonly showInitialLoading = computed(
    () => this.catalog.isLoadingProducts() && !this.catalog.hasProducts(),
  );

  protected readonly showInitialError = computed(
    () => this.catalog.productsLoadStatus() === 'error' && !this.catalog.hasProducts(),
  );

  protected readonly showReloadError = computed(
    () => this.catalog.productsLoadStatus() === 'error' && this.catalog.hasProducts(),
  );

  protected readonly productCount = computed(() => this.catalog.filteredProducts().length);

  ngOnInit(): void {
    this.catalog.ensureCatalogLoaded();
  }

  retryLoadProducts(): void {
    this.catalog.retryLoadProducts();
  }
}
