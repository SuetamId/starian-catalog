import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NormalizedHttpError } from '../../../../../core/http/http-error.model';
import { ApiProduct } from '../../../../catalog/models/product.model';
import { ProductApiService } from '../../services/product-api.service';
import { ProductStoreService } from '../../store/product-store.service';
import { ProductsListPage } from './products-list-page';

describe('ProductsListPage', () => {
  let productApi: {
    getProducts: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
  };

  const deleteError: NormalizedHttpError = {
    status: 503,
    message: 'Falha ao excluir produto.',
    recoverable: true,
  };

  const product: ApiProduct = {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest.',
    category: 'men\'s clothing',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  };

  const jeweleryProduct: ApiProduct = {
    id: 2,
    title: 'Gold Ring',
    price: 695,
    description: 'A beautiful gold ring.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/gold-ring.jpg',
  };

  const normalizedError: NormalizedHttpError = {
    status: 503,
    message: 'O serviço está temporariamente indisponível. Tente novamente.',
    recoverable: true,
  };

  beforeEach(() => {
    productApi = {
      getProducts: vi.fn(),
      getCategories: vi.fn(),
      deleteProduct: vi.fn(),
    };

    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    });

    TestBed.configureTestingModule({
      imports: [ProductsListPage],
      providers: [
        provideRouter([]),
        ProductStoreService,
        { provide: ProductApiService, useValue: productApi },
      ],
    });
  });

  it('loads products and categories on init', () => {
    productApi.getProducts.mockReturnValue(of([]));
    productApi.getCategories.mockReturnValue(of(['electronics']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    expect(productApi.getProducts).toHaveBeenCalledTimes(1);
    expect(productApi.getCategories).toHaveBeenCalledTimes(1);
  });

  it('shows loading during the initial fetch', () => {
    const productsSubject = new Subject<ApiProduct[]>();
    productApi.getProducts.mockReturnValue(productsSubject.asObservable());
    productApi.getCategories.mockReturnValue(of([]));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Carregando produtos...');

    productsSubject.next([]);
    productsSubject.complete();
    fixture.detectChanges();
  });

  it('shows error state when the initial load fails', () => {
    productApi.getProducts.mockReturnValue(throwError(() => normalizedError));
    productApi.getCategories.mockReturnValue(of([]));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(normalizedError.message);
    expect(compiled.textContent).toContain('Tentar novamente');
  });

  it('retries loading products when retry is clicked', () => {
    productApi.getProducts.mockReturnValue(throwError(() => normalizedError));
    productApi.getCategories.mockReturnValue(of([]));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    productApi.getProducts.mockReturnValue(of([product]));

    const retryButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    retryButton.click();
    fixture.detectChanges();

    expect(productApi.getProducts).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain(product.title);
  });

  it('shows empty state after a successful load with no products', () => {
    productApi.getProducts.mockReturnValue(of([]));
    productApi.getCategories.mockReturnValue(of([]));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nenhum produto encontrado.');
  });

  it('renders products after a successful load', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(product.title);
    expect(compiled.textContent).toContain('Roupas Masculinas');
    expect(compiled.textContent).toContain('R$');
  });

  it('shows registered product count in the header', () => {
    productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing', 'jewelery']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('2');
    expect(compiled.textContent).toContain('produtos cadastrados nesta sessão');
  });

  it('renders filter controls when products are available', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing', 'jewelery']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#product-filters-search')).toBeTruthy();
    expect(compiled.querySelector('#product-filters-category')).toBeTruthy();
    expect(compiled.textContent).toContain('Joias');
  });

  it('starts in list view mode', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-product-list')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-product-card-grid')).toBeNull();
  });

  it('switches to grid view mode', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const gridButton = fixture.nativeElement.querySelector(
      'button[aria-label="Visualização em cards"]',
    ) as HTMLButtonElement;
    gridButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-product-card-grid')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-product-list')).toBeNull();
  });

  it('returns to list view mode', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const gridButton = fixture.nativeElement.querySelector(
      'button[aria-label="Visualização em cards"]',
    ) as HTMLButtonElement;
    gridButton.click();
    fixture.detectChanges();

    const listButton = fixture.nativeElement.querySelector(
      'button[aria-label="Visualização em lista"]',
    ) as HTMLButtonElement;
    listButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-product-list')).toBeTruthy();
  });

  it('renders accessible view mode toggle', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const listButton = fixture.nativeElement.querySelector(
      'button[aria-label="Visualização em lista"]',
    ) as HTMLButtonElement;

    expect(listButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('uses filtered products in the list', () => {
    productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing', 'jewelery']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const store = TestBed.inject(ProductStoreService);
    store.setSearchTerm('Gold');

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Gold Ring');
    expect(compiled.textContent).not.toContain('Fjallraven Backpack');
  });

  it('shows filtered empty state when no products match filters', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const store = TestBed.inject(ProductStoreService);
    store.setSearchTerm('inexistente');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nenhum produto corresponde aos filtros aplicados.');
    expect(compiled.textContent).toContain('Tente ajustar a busca ou selecionar outra categoria.');
  });

  it('clears filters from the filtered empty state action', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const store = TestBed.inject(ProductStoreService);
    store.setSearchTerm('inexistente');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const clearButton = Array.from(buttons).find((button) =>
      button.textContent?.includes('Limpar filtros'),
    );

    expect(clearButton).toBeTruthy();
    clearButton?.click();
    fixture.detectChanges();

    expect(store.searchTerm()).toBe('');
    expect(fixture.nativeElement.textContent).toContain(product.title);
  });

  it('keeps search available when category loading fails', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(throwError(() => normalizedError));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const store = TestBed.inject(ProductStoreService);
    store.setSearchTerm('Fjallraven');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#product-filters-search')).toBeTruthy();
    expect(compiled.textContent).toContain('Fjallraven Backpack');
  });

  it('renders link to create a new product', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const createLink = fixture.nativeElement.querySelector(
      '.products-list-page__create-link',
    ) as HTMLAnchorElement;

    expect(createLink.textContent).toContain('Novo produto');
    expect(createLink.getAttribute('href')).toBe('/admin/products/new');
  });

  it('renders edit link in list view', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const editLink = fixture.nativeElement.querySelector(
      'a.product-list__action--edit',
    ) as HTMLAnchorElement;
    const detailLink = fixture.nativeElement.querySelector(
      'a[aria-label="Ver detalhes de Fjallraven Backpack"]',
    ) as HTMLAnchorElement;

    expect(editLink).toBeTruthy();
    expect(editLink.textContent).toContain('Editar');
    expect(detailLink).toBeTruthy();
    expect(detailLink.getAttribute('href')).toContain('/admin/products/1/edit');
  });

  it('renders edit link in grid view', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const gridButton = fixture.nativeElement.querySelector(
      'button[aria-label="Visualização em cards"]',
    ) as HTMLButtonElement;
    gridButton.click();
    fixture.detectChanges();

    const editLink = fixture.nativeElement.querySelector(
      'a.product-card-grid__action--edit',
    ) as HTMLAnchorElement;
    const detailLink = fixture.nativeElement.querySelector(
      'a[aria-label="Ver detalhes de Fjallraven Backpack"]',
    ) as HTMLAnchorElement;

    expect(editLink).toBeTruthy();
    expect(detailLink).toBeTruthy();
  });

  it('opens dialog when delete is requested from the list', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector(
      'button[aria-label="Excluir Fjallraven Backpack"]',
    ) as HTMLButtonElement;
    deleteButton.click();
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Excluir produto?');
    expect(fixture.nativeElement.textContent).toContain(product.title);
  });

  it('calls deleteProduct when deletion is confirmed', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));
    productApi.deleteProduct.mockReturnValue(of(undefined));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector(
      'button[aria-label="Excluir Fjallraven Backpack"]',
    ) as HTMLButtonElement;
    deleteButton.click();
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector(
      '.confirm-dialog__confirm',
    ) as HTMLButtonElement;
    confirmButton.click();
    fixture.detectChanges();

    expect(productApi.deleteProduct).toHaveBeenCalledWith(product.id);
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBe(false);
  });

  it('closes dialog and clears selection after successful deletion', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));
    productApi.deleteProduct.mockReturnValue(of(undefined));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    fixture.componentInstance.onDeleteRequested(product);
    fixture.detectChanges();
    fixture.componentInstance.onDeleteConfirmed();
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain(product.title);
  });

  it('keeps dialog open and shows delete error after failure', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));
    productApi.deleteProduct.mockReturnValue(throwError(() => deleteError));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    fixture.componentInstance.onDeleteRequested(product);
    fixture.detectChanges();
    fixture.componentInstance.onDeleteConfirmed();
    fixture.detectChanges();

    const store = TestBed.inject(ProductStoreService);
    expect(store.products()).toEqual([product]);
    expect(fixture.nativeElement.textContent).toContain(deleteError.message);
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBe(true);
  });

  it('does not call deleteProduct when deletion is cancelled', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    fixture.componentInstance.onDeleteRequested(product);
    fixture.detectChanges();
    fixture.componentInstance.onDeleteCancelled();
    fixture.detectChanges();

    expect(productApi.deleteProduct).not.toHaveBeenCalled();
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBe(false);
  });

  it('clears delete error when deletion is cancelled', () => {
    productApi.getProducts.mockReturnValue(of([product]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing']));
    productApi.deleteProduct.mockReturnValue(throwError(() => deleteError));

    const fixture = TestBed.createComponent(ProductsListPage);
    const store = TestBed.inject(ProductStoreService);
    fixture.detectChanges();

    fixture.componentInstance.onDeleteRequested(product);
    fixture.detectChanges();
    fixture.componentInstance.onDeleteConfirmed();
    fixture.detectChanges();
    expect(store.deleteError()).toEqual(deleteError);

    fixture.componentInstance.onDeleteCancelled();
    fixture.detectChanges();

    expect(store.deleteError()).toBeNull();
  });

  it('propagates deletingProductId to delete buttons', () => {
    productApi.getProducts.mockReturnValue(of([product, jeweleryProduct]));
    productApi.getCategories.mockReturnValue(of(['men\'s clothing', 'jewelery']));
    const deleteSubject = new Subject<void>();
    productApi.deleteProduct.mockReturnValue(deleteSubject.asObservable());

    const fixture = TestBed.createComponent(ProductsListPage);
    fixture.detectChanges();

    fixture.componentInstance.onDeleteRequested(product);
    fixture.detectChanges();
    fixture.componentInstance.onDeleteConfirmed();
    fixture.detectChanges();

    const disabledButtons = fixture.nativeElement.querySelectorAll(
      'button[aria-label="Excluir Fjallraven Backpack"][disabled]',
    ) as NodeListOf<HTMLButtonElement>;

    expect(disabledButtons.length).toBeGreaterThanOrEqual(1);
  });
});
