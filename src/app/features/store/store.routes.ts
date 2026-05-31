import { Routes } from '@angular/router';

export const STORE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./catalog/pages/catalog-page/catalog-page').then((m) => m.CatalogPage),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product-details/pages/product-details-page/product-details-page').then(
        (m) => m.ProductDetailsPage,
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/pages/cart-page/cart-page').then((m) => m.CartPage),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/pages/checkout-page/checkout-page').then((m) => m.CheckoutPage),
  },
  {
    path: 'order-success',
    loadComponent: () =>
      import('./checkout/pages/order-success-page/order-success-page').then(
        (m) => m.OrderSuccessPage,
      ),
  },
];
