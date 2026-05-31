import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ApiProduct } from '../../models/product.model';
import { CategoryChip } from '../category-chip/category-chip';
import { ProductImage } from '../product-image/product-image';
import { ProductRating } from '../product-rating/product-rating';

@Component({
  selector: 'app-product-card',
  imports: [CategoryChip, CurrencyPipe, ProductImage, ProductRating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<ApiProduct>();
  readonly titleLevel = input<'h2' | 'h3'>('h3');
  readonly imageWidth = input(176);
  readonly imageHeight = input(176);
  readonly deferImage = input(true);
}
