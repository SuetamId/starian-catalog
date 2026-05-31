import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type StarState = 'full' | 'half' | 'empty';

@Component({
  selector: 'app-product-rating',
  imports: [DecimalPipe],
  templateUrl: './product-rating.html',
  styleUrl: './product-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRating {
  readonly rate = input.required<number>();
  readonly count = input<number | null>(null);
  readonly compact = input(false);

  protected readonly stars = computed<StarState[]>(() => {
    const normalizedRate = Math.min(Math.max(this.rate(), 0), 5);

    return Array.from({ length: 5 }, (_, index) => {
      const starValue = normalizedRate - index;

      if (starValue >= 1) {
        return 'full';
      }

      if (starValue >= 0.5) {
        return 'half';
      }

      return 'empty';
    });
  });

  protected readonly ariaLabel = computed(() => {
    const count = this.count();

    if (count === null) {
      return `Avaliação ${this.rate()} de 5 estrelas`;
    }

    return `Avaliação ${this.rate()} de 5 estrelas, ${count} avaliações`;
  });

  protected readonly countLabel = computed(() => {
    const count = this.count();

    if (count === null) {
      return null;
    }

    return count === 1 ? '1 avaliação' : `${count} avaliações`;
  });
}
