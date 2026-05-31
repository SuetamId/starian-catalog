import { Injectable } from '@angular/core';

import { StoreCartItem, StoreCartState } from '../models/cart.model';

const STORAGE_KEY = 'starian-store-cart';

@Injectable({ providedIn: 'root' })
export class CartStorageAdapter {
  load(): StoreCartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as StoreCartItem[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (item) =>
          item &&
          typeof item.quantity === 'number' &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          item.product &&
          typeof item.product.id === 'number',
      );
    } catch {
      return [];
    }
  }

  save(state: StoreCartState): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }

  clear(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }
}
