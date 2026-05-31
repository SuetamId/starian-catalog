import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiProduct } from '../../../catalog/models/product.model';
import { CartStorageAdapter } from './cart-storage.adapter';
import { CartStoreService } from './cart-store.service';

describe('CartStoreService', () => {
  const product: ApiProduct = {
    id: 1,
    title: 'Backpack',
    price: 109.95,
    description: 'Everyday pack.',
    category: 'bags',
    image: 'https://example.com/1.jpg',
  };

  let storageMock: {
    load: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    storageMock = {
      load: vi.fn(() => []),
      save: vi.fn(),
      clear: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CartStoreService,
        { provide: CartStorageAdapter, useValue: storageMock },
      ],
    });
  });

  it('adds items and updates totals', () => {
    const cart = TestBed.inject(CartStoreService);

    cart.addItem(product, 2);

    expect(cart.totalItems()).toBe(2);
    expect(cart.subtotal()).toBeCloseTo(219.9);
    expect(cart.items()[0]?.product.id).toBe(1);
  });

  it('merges quantities for the same product', () => {
    const cart = TestBed.inject(CartStoreService);

    cart.addItem(product);
    cart.addItem(product);

    expect(cart.totalItems()).toBe(2);
    expect(cart.items()).toHaveLength(1);
  });

  it('removes items and clears the cart', () => {
    const cart = TestBed.inject(CartStoreService);

    cart.addItem(product);
    cart.removeItem(product.id);

    expect(cart.isEmpty()).toBe(true);

    cart.addItem(product);
    cart.clearCart();

    expect(cart.isEmpty()).toBe(true);
    expect(storageMock.clear).toHaveBeenCalled();
  });

  it('persists cart changes through the storage adapter', () => {
    const cart = TestBed.inject(CartStoreService);

    cart.addItem(product);
    TestBed.flushEffects();

    expect(storageMock.save).toHaveBeenCalled();
  });
});
