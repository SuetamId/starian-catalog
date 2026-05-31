import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ApiProduct } from '../../models/product.model';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  const product: ApiProduct = {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use.',
    category: 'men\'s clothing',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductCard],
    });
  });

  it('renders product details', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Fjallraven Backpack');
    expect(fixture.nativeElement.textContent).toContain('R$');
    expect(fixture.nativeElement.querySelector('app-category-chip')).toBeTruthy();
  });

  it('renders rating when product has rating data', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', {
      ...product,
      rating: { rate: 3.9, count: 120 },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-product-rating')).toBeTruthy();
  });
});
