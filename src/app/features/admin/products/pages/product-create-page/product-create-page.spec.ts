import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NormalizedHttpError } from '../../../../../core/http/http-error.model';
import { ApiProduct, CreateProductPayload } from '../../../../catalog/models/product.model';
import { ProductApiService } from '../../services/product-api.service';
import { ProductStoreService } from '../../store/product-store.service';
import { ProductCreatePage } from './product-create-page';

describe('ProductCreatePage', () => {
  let router: Router;
  let productApi: {
    getCategories: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
  };

  const payload: CreateProductPayload = {
    title: 'New Backpack',
    price: 99.9,
    description: 'A valid product description.',
    category: 'electronics',
    image: 'https://example.com/image.jpg',
  };

  const createdProduct: ApiProduct = {
    id: 10,
    ...payload,
  };

  const normalizedError: NormalizedHttpError = {
    status: 503,
    message: 'Falha ao salvar produto.',
    recoverable: true,
  };

  beforeEach(() => {
    productApi = {
      getCategories: vi.fn().mockReturnValue(of(['electronics'])),
      createProduct: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ProductCreatePage],
      providers: [
        provideRouter([{ path: 'admin/products', component: ProductCreatePage }]),
        ProductStoreService,
        { provide: ProductApiService, useValue: productApi },
      ],
    });

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('loads categories when needed and renders the form', () => {
    const fixture = TestBed.createComponent(ProductCreatePage);
    fixture.detectChanges();

    expect(productApi.getCategories).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('app-product-form')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Novo produto');
  });

  it('calls createProduct with payload and navigates on success', async () => {
    productApi.createProduct.mockReturnValue(of(createdProduct));

    const fixture = TestBed.createComponent(ProductCreatePage);
    fixture.detectChanges();

    fixture.componentInstance.onSave(payload);
    await firstValueFrom(of(null));

    expect(productApi.createProduct).toHaveBeenCalledWith(payload);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/products']);
  });

  it('does not navigate and preserves form values on failure', () => {
    productApi.createProduct.mockReturnValue(throwError(() => normalizedError));

    const fixture = TestBed.createComponent(ProductCreatePage);
    fixture.detectChanges();

    fixture.componentInstance.onSave(payload);
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(normalizedError.message);
    expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
  });

  it('navigates to list page on cancel', () => {
    const fixture = TestBed.createComponent(ProductCreatePage);
    fixture.detectChanges();

    fixture.componentInstance.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/products']);
  });
});
