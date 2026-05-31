import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { getCategoryLabel } from '../../utils/category-labels';

@Component({
  selector: 'app-category-chip',
  templateUrl: './category-chip.html',
  styleUrl: './category-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChip {
  readonly category = input<string | null>(null);
  readonly label = input('');
  readonly muted = input(false);

  protected readonly displayLabel = computed(() => {
    const category = this.category();

    if (category) {
      return getCategoryLabel(category);
    }

    return this.label();
  });
}
