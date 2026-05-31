import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CategoryChip } from '../../../../catalog/components/category-chip/category-chip';
import { ProductImage } from '../../../../catalog/components/product-image/product-image';
import { ProductRating } from '../../../../catalog/components/product-rating/product-rating';
import { CartStoreService } from '../../store/cart-store.service';
import { CatalogStoreService } from '../../../catalog/services/catalog-store.service';

@Component({
  selector: 'app-cart-page',
  imports: [CategoryChip, CurrencyPipe, ProductImage, ProductRating, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  protected readonly cart = inject(CartStoreService);
  private readonly catalog = inject(CatalogStoreService);

  ngOnInit(): void {
    this.catalog.ensureCatalogLoaded();
    this.cart.hydrateFromCatalog();
  }

  incrementQuantity(productId: number, currentQuantity: number): void {
    this.cart.setQuantity(productId, currentQuantity + 1);
  }

  decrementQuantity(productId: number, currentQuantity: number): void {
    this.cart.setQuantity(productId, currentQuantity - 1);
  }

  removeItem(productId: number): void {
    this.cart.removeItem(productId);
  }
}
