import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';

describe('App routing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('redirects root to admin products list page', async () => {
    const harness = await RouterTestingHarness.create('/');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/admin/products');
    expect(harness.routeNativeElement?.textContent).toContain('Produtos');
    expect(harness.routeNativeElement?.textContent).toContain('Carregando produtos...');
  });

  it('redirects unknown routes to admin products', async () => {
    await RouterTestingHarness.create('/rota-desconhecida');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/admin/products');
  });

  it('loads the public store catalog route', async () => {
    const harness = await RouterTestingHarness.create('/store');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/store');
    expect(harness.routeNativeElement?.textContent).toContain('Catálogo');
  });

  it('loads the public store cart route', async () => {
    const harness = await RouterTestingHarness.create('/store/cart');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/store/cart');
    expect(harness.routeNativeElement?.textContent).toContain('Carrinho');
  });
});
