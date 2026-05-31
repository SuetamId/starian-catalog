import { beforeEach, describe, expect, it } from 'vitest';

import { ApiProduct } from '../../../catalog/models/product.model';
import { CartStorageAdapter } from './cart-storage.adapter';

describe('CartStorageAdapter', () => {
  const product: ApiProduct = {
    id: 1,
    title: 'Backpack',
    price: 109.95,
    description: 'Everyday pack.',
    category: 'bags',
    image: 'https://example.com/1.jpg',
  };

  let adapter: CartStorageAdapter;

  beforeEach(() => {
    localStorage.clear();
    adapter = new CartStorageAdapter();
  });

  it('loads an empty cart when storage is missing', () => {
    expect(adapter.load()).toEqual([]);
  });

  it('saves and loads cart items', () => {
    adapter.save({ items: [{ product, quantity: 2 }] });

    expect(adapter.load()).toEqual([{ product, quantity: 2 }]);
  });

  it('clears persisted cart data', () => {
    adapter.save({ items: [{ product, quantity: 1 }] });
    adapter.clear();

    expect(adapter.load()).toEqual([]);
  });
});
