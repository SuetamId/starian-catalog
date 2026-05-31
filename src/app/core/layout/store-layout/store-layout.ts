import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CatalogStoreService } from '../../../features/store/catalog/services/catalog-store.service';
import { CartStoreService } from '../../../features/store/cart/store/cart-store.service';
import { ToastContainer } from '../../../shared/ui/toast/toast-container';

@Component({
  selector: 'app-store-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ToastContainer],
  templateUrl: './store-layout.html',
  styleUrl: './store-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreLayout implements OnInit {
  protected readonly cart = inject(CartStoreService);
  private readonly catalog = inject(CatalogStoreService);

  protected readonly cartAriaLabel = computed(() => {
    const itemCount = this.cart.totalItems();
    return itemCount > 0
      ? `Carrinho de compras, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`
      : 'Carrinho de compras, vazio';
  });

  ngOnInit(): void {
    this.catalog.ensureCatalogLoaded();
    this.cart.hydrateFromCatalog();
  }
}
