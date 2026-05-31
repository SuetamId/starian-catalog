import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { routes } from '../../../app.routes';
import { ProductApiService } from './services/product-api.service';

describe('Products routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        {
          provide: ProductApiService,
          useValue: {
            getProducts: vi.fn().mockReturnValue(of([])),
            getCategories: vi.fn().mockReturnValue(of(['electronics'])),
            getProductById: vi.fn().mockReturnValue(
              of({
                id: 1,
                title: 'Fjallraven Backpack',
                price: 109.95,
                description: 'Your perfect pack for everyday use.',
                category: 'men\'s clothing',
                image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
              }),
            ),
            createProduct: vi.fn(),
            updateProduct: vi.fn(),
            deleteProduct: vi.fn(),
          },
        },
      ],
    });
  });

  it('loads create page at /admin/products/new', async () => {
    const harness = await RouterTestingHarness.create('/admin/products/new');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/admin/products/new');
    expect(harness.routeNativeElement?.textContent).toContain('Novo produto');
  });

  it('loads edit page at /admin/products/:id/edit', async () => {
    const harness = await RouterTestingHarness.create('/admin/products/1/edit');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/admin/products/1/edit');
    expect(harness.routeNativeElement?.textContent).toContain('Editar produto');
  });
});
