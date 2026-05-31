import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products-list-page/products-list-page').then((m) => m.ProductsListPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/product-create-page/product-create-page').then((m) => m.ProductCreatePage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/product-edit-page/product-edit-page').then((m) => m.ProductEditPage),
  },
];
