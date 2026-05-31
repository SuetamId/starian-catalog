import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');
  readonly isProcessing = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
  readonly closed = output<void>();

  protected readonly titleId = 'confirm-dialog-title';
  protected readonly descriptionId = 'confirm-dialog-description';
  protected readonly errorId = 'confirm-dialog-error';

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');
  private triggerElement: HTMLElement | null = null;

  open(): void {
    const dialog = this.dialogRef().nativeElement;

    if (dialog.open) {
      return;
    }

    this.triggerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
  }

  close(): void {
    const dialog = this.dialogRef().nativeElement;

    if (!dialog.open) {
      return;
    }

    dialog.close();
  }

  onConfirmClick(): void {
    if (this.isProcessing()) {
      return;
    }

    this.confirmed.emit();
  }

  onCancelClick(): void {
    if (this.isProcessing()) {
      return;
    }

    this.cancelled.emit();
    this.close();
  }

  onDialogCancel(event: Event): void {
    if (this.isProcessing()) {
      event.preventDefault();
      return;
    }

    this.cancelled.emit();
  }

  onDialogClose(): void {
    this.restoreFocus();
    this.closed.emit();
  }

  private restoreFocus(): void {
    this.triggerElement?.focus();
    this.triggerElement = null;
  }
}
