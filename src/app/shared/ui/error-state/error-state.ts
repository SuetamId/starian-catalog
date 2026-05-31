import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.error-state--compact]': 'compact()',
  },
})
export class ErrorState {
  readonly message = input.required<string>();
  readonly retryLabel = input('Tentar novamente');
  readonly compact = input(false);
  readonly retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
