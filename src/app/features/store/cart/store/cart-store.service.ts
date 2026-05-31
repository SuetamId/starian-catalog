import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { ApiProduct } from '../../../catalog/models/product.model';
import { ProductStoreService } from '../../../admin/products/store/product-store.service';
import { StoreCartItem } from '../models/cart.model';
import { CartStorageAdapter } from './cart-storage.adapter';

@Injectable({ providedIn: 'root' })
export class CartStoreService {
  private readonly storage = inject(CartStorageAdapter);
  private readonly productStore = inject(ProductStoreService);

  private readonly itemsState = signal<StoreCartItem[]>(this.storage.load());

  readonly items = this.itemsState.asReadonly();

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  readonly isEmpty = computed(() => this.items().length === 0);

  readonly canCheckout = computed(() => this.totalItems() > 0);

  constructor() {
    effect(() => {
      this.storage.save({ items: this.itemsState() });
    });
  }

  hydrateFromCatalog(): void {
    const productMap = new Map(this.productStore.products().map((product) => [product.id, product]));

    this.itemsState.update((items) =>
      items
        .map((item) => {
          const product = productMap.get(item.product.id);
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter((item): item is StoreCartItem => item !== null),
    );
  }

  addItem(product: ApiProduct, quantity = 1): void {
    const safeQuantity = Math.max(1, Math.floor(quantity));

    this.itemsState.update((items) => {
      const existingIndex = items.findIndex((item) => item.product.id === product.id);

      if (existingIndex === -1) {
        return [...items, { product, quantity: safeQuantity }];
      }

      return items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + safeQuantity }
          : item,
      );
    });
  }

  removeItem(productId: number): void {
    this.itemsState.update((items) => items.filter((item) => item.product.id !== productId));
  }

  setQuantity(productId: number, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.itemsState.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  clearCart(): void {
    this.itemsState.set([]);
    this.storage.clear();
  }
}
