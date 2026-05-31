import { Routes } from '@angular/router';

import { AdminLayout } from './core/layout/admin-layout/admin-layout';
import { StoreLayout } from './core/layout/store-layout/store-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/products',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/admin/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
      },
    ],
  },
  {
    path: 'store',
    component: StoreLayout,
    loadChildren: () => import('./features/store/store.routes').then((m) => m.STORE_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'admin/products',
  },
];
