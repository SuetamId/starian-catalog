import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filtered-empty-state',
  templateUrl: './filtered-empty-state.html',
  styleUrl: './filtered-empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilteredEmptyState {
  readonly title = input('Nenhum produto corresponde aos filtros aplicados.');
  readonly message = input('Tente ajustar a busca ou selecionar outra categoria.');
  readonly clearLabel = input('Limpar filtros');
  readonly titleId = input('filtered-empty-title');

  readonly clearFilters = output<void>();

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
