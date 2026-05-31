import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiProduct } from '../../../../catalog/models/product.model';
import { ProductList } from './product-list';

describe('ProductList', () => {
  const products: ApiProduct[] = [
    {
      id: 1,
      title: 'Fjallraven Backpack',
      price: 109.95,
      description: 'Your perfect pack for everyday use.',
      category: 'men\'s clothing',
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
    {
      id: 2,
      title: 'Gold Ring',
      price: 695,
      description: 'A beautiful gold ring.',
      category: 'jewelery',
      image: 'https://fakestoreapi.com/img/gold-ring.jpg',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [provideRouter([])],
    });
  });

  it('renders products', () => {
    const fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Fjallraven Backpack');
    expect(fixture.nativeElement.textContent).toContain('Gold Ring');
  });

  it('renders category chip', () => {
    const fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('app-category-chip') as HTMLElement;
    expect(chip).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Roupas Masculinas');
  });

  it('renders price', () => {
    const fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('R$');
  });

  it('keeps edit link', () => {
    const fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('a[aria-label="Editar Gold Ring"]'),
    ).toBeTruthy();
  });

  it('links the list row body to the product edit page', () => {
    const fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    const rowLink = fixture.nativeElement.querySelector(
      'a[aria-label="Ver detalhes de Fjallraven Backpack"]',
    ) as HTMLAnchorElement;

    expect(rowLink).toBeTruthy();
    expect(rowLink.getAttribute('href')).toContain('/admin/products/1/edit');
  });

  it('emits deleteRequested', () => {
    const fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    const deleteSpy = vi.fn();
    fixture.componentInstance.deleteRequested.subscribe(deleteSpy);

    const deleteButton = fixture.nativeElement.querySelector(
      'button[aria-label="Excluir Gold Ring"]',
    ) as HTMLButtonElement;
    deleteButton.click();

    expect(deleteSpy).toHaveBeenCalledWith(products[1]);
  });

  it('disables delete only for the product being deleted', () => {
    const fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', products);
    fixture.componentRef.setInput('deletingProductId', 1);
    fixture.detectChanges();

    const firstDeleteButton = fixture.nativeElement.querySelector(
      'button[aria-label="Excluir Fjallraven Backpack"]',
    ) as HTMLButtonElement;
    const secondDeleteButton = fixture.nativeElement.querySelector(
      'button[aria-label="Excluir Gold Ring"]',
    ) as HTMLButtonElement;

    expect(firstDeleteButton.disabled).toBe(true);
    expect(secondDeleteButton.disabled).toBe(false);
  });
});
