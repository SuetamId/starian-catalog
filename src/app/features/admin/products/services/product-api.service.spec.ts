import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { API_CONFIG } from '../../../../core/config/api.config';
import {
  ApiProduct,
  CreateProductPayload,
  UpdateProductPayload,
} from '../../../catalog/models/product.model';
import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpTestingController: HttpTestingController;

  const baseUrl = API_CONFIG.baseUrl;

  const product: ApiProduct = {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use.',
    category: 'men\'s clothing',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  };

  const createPayload: CreateProductPayload = {
    title: 'New Product',
    price: 49.99,
    description: 'A new product description.',
    category: 'electronics',
    image: 'https://example.com/product.jpg',
  };

  const updatePayload: UpdateProductPayload = {
    title: 'Updated Product',
    price: 59.99,
    description: 'An updated product description.',
    category: 'jewelery',
    image: 'https://example.com/updated.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('gets products', async () => {
    const productsPromise = firstValueFrom(service.getProducts());

    const request = httpTestingController.expectOne(`${baseUrl}/products`);
    expect(request.request.method).toBe('GET');
    request.flush([product]);

    await expect(productsPromise).resolves.toEqual([product]);
  });

  it('gets product by id', async () => {
    const productPromise = firstValueFrom(service.getProductById(product.id));

    const request = httpTestingController.expectOne(`${baseUrl}/products/${product.id}`);
    expect(request.request.method).toBe('GET');
    request.flush(product);

    await expect(productPromise).resolves.toEqual(product);
  });

  it('gets categories', async () => {
    const categories = ['electronics', 'jewelery', 'men\'s clothing'];

    const categoriesPromise = firstValueFrom(service.getCategories());

    const request = httpTestingController.expectOne(`${baseUrl}/products/categories`);
    expect(request.request.method).toBe('GET');
    request.flush(categories);

    await expect(categoriesPromise).resolves.toEqual(categories);
  });

  it('creates a product with the expected payload', async () => {
    const createdProduct: ApiProduct = { id: 21, ...createPayload };
    const createPromise = firstValueFrom(service.createProduct(createPayload));

    const request = httpTestingController.expectOne(`${baseUrl}/products`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(createPayload);
    request.flush(createdProduct);

    await expect(createPromise).resolves.toEqual(createdProduct);
  });

  it('updates a product with the expected payload', async () => {
    const updatedProduct: ApiProduct = { id: product.id, ...updatePayload };
    const updatePromise = firstValueFrom(service.updateProduct(product.id, updatePayload));

    const request = httpTestingController.expectOne(`${baseUrl}/products/${product.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatePayload);
    request.flush(updatedProduct);

    await expect(updatePromise).resolves.toEqual(updatedProduct);
  });

  it('deletes a product', async () => {
    const deletePromise = firstValueFrom(service.deleteProduct(product.id));

    const request = httpTestingController.expectOne(`${baseUrl}/products/${product.id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);

    await expect(deletePromise).resolves.toBeNull();
  });
});
