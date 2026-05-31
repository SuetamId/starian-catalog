import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductCard } from '../../../catalog/components/product-card/product-card';
import { ApiProduct } from '../../../catalog/models/product.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { CartStoreService } from '../../cart/store/cart-store.service';

@Component({
  selector: 'app-store-product-grid',
  imports: [ProductCard, RouterLink],
  templateUrl: './store-product-grid.html',
  styleUrl: './store-product-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProductGrid {
  private readonly cart = inject(CartStoreService);
  private readonly toast = inject(ToastService);

  readonly products = input.required<ApiProduct[]>();

  addToCart(product: ApiProduct, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cart.addItem(product);
    this.toast.showSuccess(`${product.title} adicionado ao carrinho.`);
  }
}
