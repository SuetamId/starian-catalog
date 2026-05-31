import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { getCategoryLabel } from '../../utils/category-labels';
@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilters {
  readonly categories = input.required<string[]>();
  readonly searchTerm = input('');
  readonly selectedCategory = input<string | null>(null);
  readonly searchPlaceholder = input('Buscar produtos...');
  readonly fieldIdPrefix = input('product-filters');

  readonly searchTermChange = output<string>();
  readonly selectedCategoryChange = output<string | null>();
  readonly clearFilters = output<void>();

  protected readonly searchFieldId = computed(() => `${this.fieldIdPrefix()}-search`);
  protected readonly categoryFieldId = computed(() => `${this.fieldIdPrefix()}-category`);

  protected readonly hasActiveFilters = computed(
    () => this.searchTerm().length > 0 || this.selectedCategory() !== null,
  );

  protected readonly categoryLabel = getCategoryLabel;

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTermChange.emit(value);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryChange.emit(value === '' ? null : value);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
