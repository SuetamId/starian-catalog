import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { NormalizedHttpError } from '../../../../../core/http/http-error.model';
import { ErrorState } from '../../../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../../../shared/ui/loading-state/loading-state';
import { CategoryChip } from '../../../../catalog/components/category-chip/category-chip';
import { ProductImage } from '../../../../catalog/components/product-image/product-image';
import { ProductRating } from '../../../../catalog/components/product-rating/product-rating';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { ApiProduct } from '../../../../catalog/models/product.model';
import { CartStoreService } from '../../../cart/store/cart-store.service';
import { CatalogStoreService } from '../../../catalog/services/catalog-store.service';

@Component({
  selector: 'app-product-details-page',
  imports: [CategoryChip, CurrencyPipe, ErrorState, LoadingState, ProductImage, ProductRating, RouterLink],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cart = inject(CartStoreService);
  private readonly toast = inject(ToastService);
  protected readonly catalog = inject(CatalogStoreService);

  protected readonly product = signal<ApiProduct | null>(null);
  protected readonly isResolving = signal(true);
  protected readonly resolveError = signal<string | null>(null);

  ngOnInit(): void {
    this.catalog.ensureCatalogLoaded();
    this.resolveProduct();
  }

  retryResolveProduct(): void {
    this.resolveProduct();
  }

  addToCart(product: ApiProduct): void {
    this.cart.addItem(product);
    this.toast.showSuccess(`${product.title} adicionado ao carrinho.`);
  }

  private resolveProduct(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
      this.isResolving.set(false);
      this.resolveError.set('Identificador de produto inválido.');
      this.product.set(null);
      return;
    }

    this.isResolving.set(true);
    this.resolveError.set(null);
    this.product.set(null);

    this.catalog
      .resolveProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resolvedProduct) => {
          this.product.set(resolvedProduct);
          this.isResolving.set(false);
        },
        error: (error: NormalizedHttpError) => {
          this.resolveError.set(error.message);
          this.isResolving.set(false);
        },
      });
  }
}
