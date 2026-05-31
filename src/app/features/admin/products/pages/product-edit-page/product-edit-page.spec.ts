import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NormalizedHttpError } from '../../../../../core/http/http-error.model';
import { ApiProduct, UpdateProductPayload } from '../../../../catalog/models/product.model';
import { ProductApiService } from '../../services/product-api.service';
import { ProductStoreService } from '../../store/product-store.service';
import { ProductEditPage } from './product-edit-page';

describe('ProductEditPage', () => {
  let router: Router;
  let productApi: {
    getCategories: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
  };

  const product: ApiProduct = {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use.',
    category: 'men\'s clothing',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  };

  const updatePayload: UpdateProductPayload = {
    title: 'Updated Backpack',
    price: 119.95,
    description: 'Updated product description.',
    category: 'men\'s clothing',
    image: product.image,
  };

  const updatedProduct: ApiProduct = {
    id: product.id,
    ...updatePayload,
  };

  const normalizedError: NormalizedHttpError = {
    status: 503,
    message: 'Falha ao atualizar produto.',
    recoverable: true,
  };

  beforeEach(() => {
    productApi = {
      getCategories: vi.fn().mockReturnValue(of(['men\'s clothing'])),
      getProductById: vi.fn(),
      updateProduct: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ProductEditPage],
      providers: [
        provideRouter([{ path: 'admin/products/:id/edit', component: ProductEditPage }]),
        ProductStoreService,
        { provide: ProductApiService, useValue: productApi },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('shows loading while resolving product', () => {
    const resolveSubject = new Subject<ApiProduct>();
    productApi.getProductById.mockReturnValue(resolveSubject.asObservable());

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Carregando produtos...');

    resolveSubject.next(product);
    resolveSubject.complete();
  });

  it('renders filled form after successful resolve', () => {
    productApi.getProductById.mockReturnValue(of(product));

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Editar produto');
    expect((fixture.nativeElement.querySelector('#product-title') as HTMLInputElement).value).toBe(
      product.title,
    );
  });

  it('shows recoverable error when initial resolve fails', () => {
    productApi.getProductById.mockReturnValue(throwError(() => normalizedError));

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(normalizedError.message);
    expect(fixture.nativeElement.textContent).toContain('Tentar novamente');
  });

  it('retries resolve after initial failure', () => {
    productApi.getProductById
      .mockReturnValueOnce(throwError(() => normalizedError))
      .mockReturnValueOnce(of(product));

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    const retryButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    retryButton.click();
    fixture.detectChanges();

    expect(productApi.getProductById).toHaveBeenCalledTimes(2);
    expect((fixture.nativeElement.querySelector('#product-title') as HTMLInputElement).value).toBe(
      product.title,
    );
  });

  it('handles invalid route id', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProductEditPage],
      providers: [
        provideRouter([{ path: 'admin/products/:id/edit', component: ProductEditPage }]),
        ProductStoreService,
        { provide: ProductApiService, useValue: productApi },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'abc',
              },
            },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Identificador de produto inválido.');
  });

  it('calls updateProduct and navigates on success', async () => {
    productApi.getProductById.mockReturnValue(of(product));
    productApi.updateProduct.mockReturnValue(of(updatedProduct));

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    fixture.componentInstance.onSave(updatePayload);
    await firstValueFrom(of(null));

    expect(productApi.updateProduct).toHaveBeenCalledWith(product.id, updatePayload);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/products']);
  });

  it('does not navigate on update failure and preserves form values', () => {
    productApi.getProductById.mockReturnValue(of(product));
    productApi.updateProduct.mockReturnValue(throwError(() => normalizedError));

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    fixture.componentInstance.onSave(updatePayload);
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect((fixture.nativeElement.querySelector('#product-title') as HTMLInputElement).value).toBe(
      product.title,
    );
    expect(fixture.nativeElement.textContent).toContain(normalizedError.message);
  });

  it('navigates to list page on cancel', () => {
    productApi.getProductById.mockReturnValue(of(product));

    const fixture = TestBed.createComponent(ProductEditPage);
    fixture.detectChanges();

    fixture.componentInstance.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/products']);
  });
});
