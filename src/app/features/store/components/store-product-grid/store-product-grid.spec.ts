import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiProduct } from '../../../catalog/models/product.model';
import { CartStoreService } from '../../cart/store/cart-store.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { StoreProductGrid } from './store-product-grid';

describe('StoreProductGrid', () => {
  const products: ApiProduct[] = [
    {
      id: 1,
      title: 'Fjallraven Backpack',
      price: 109.95,
      description: 'Your perfect pack for everyday use.',
      category: 'men\'s clothing',
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
  ];

  const cartMock = {
    addItem: vi.fn(),
  };

  const toastMock = {
    showSuccess: vi.fn(),
  };

  beforeEach(() => {
    cartMock.addItem.mockReset();
    toastMock.showSuccess.mockReset();

    TestBed.configureTestingModule({
      imports: [StoreProductGrid],
      providers: [
        provideRouter([]),
        { provide: CartStoreService, useValue: cartMock },
        { provide: ToastService, useValue: toastMock },
      ],
    });
  });

  it('renders product cards linked to the details page', () => {
    const fixture = TestBed.createComponent(StoreProductGrid);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      'a[aria-label="Ver detalhes de Fjallraven Backpack"]',
    ) as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('/store/products/1');
    expect(fixture.nativeElement.textContent).toContain('R$');
  });

  it('adds the product to the cart when clicking buy', () => {
    const fixture = TestBed.createComponent(StoreProductGrid);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[aria-label="Adicionar Fjallraven Backpack ao carrinho"]',
    ) as HTMLButtonElement;

    button.click();

    expect(cartMock.addItem).toHaveBeenCalledWith(products[0]);
    expect(toastMock.showSuccess).toHaveBeenCalled();
  });
});
