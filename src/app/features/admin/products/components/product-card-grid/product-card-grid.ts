import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiProduct } from '../../../../catalog/models/product.model';
import { ProductCard } from '../../../../catalog/components/product-card/product-card';

@Component({
  selector: 'app-product-card-grid',
  imports: [ProductCard, RouterLink],
  templateUrl: './product-card-grid.html',
  styleUrl: './product-card-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardGrid {
  readonly products = input.required<ApiProduct[]>();
  readonly deletingProductId = input<number | null>(null);

  readonly deleteRequested = output<ApiProduct>();

  requestDelete(product: ApiProduct): void {
    this.deleteRequested.emit(product);
  }

  isDeleting(product: ApiProduct): boolean {
    return this.deletingProductId() === product.id;
  }
}
