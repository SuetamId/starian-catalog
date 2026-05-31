import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CategoryChip } from '../../../../catalog/components/category-chip/category-chip';
import { ProductImage } from '../../../../catalog/components/product-image/product-image';
import { ApiProduct } from '../../../../catalog/models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CategoryChip, CurrencyPipe, ProductImage, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
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
