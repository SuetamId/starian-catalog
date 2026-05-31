import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDialog],
    });

    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    });
  });

  function createDialog() {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('title', 'Excluir produto?');
    fixture.componentRef.setInput(
      'message',
      'Tem certeza de que deseja excluir “Produto”? Esta ação será refletida somente na sessão atual.',
    );
    fixture.componentRef.setInput('confirmLabel', 'Excluir produto');
    fixture.detectChanges();
    return fixture;
  }

  it('renders title and message', () => {
    const fixture = createDialog();

    expect(fixture.nativeElement.textContent).toContain('Excluir produto?');
    expect(fixture.nativeElement.textContent).toContain('Tem certeza de que deseja excluir');
  });

  it('renders title with dialog title class for readable contrast', () => {
    const fixture = createDialog();
    const title = fixture.nativeElement.querySelector('.confirm-dialog__title') as HTMLElement;

    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Excluir produto?');
  });

  it('opens with open() and closes with close()', () => {
    const fixture = createDialog();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;

    fixture.componentInstance.open();
    expect(dialog.open).toBe(true);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    fixture.componentInstance.close();
    expect(dialog.open).toBe(false);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('emits confirmed when confirm button is clicked', () => {
    const fixture = createDialog();
    const confirmedSpy = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmedSpy);

    const confirmButton = fixture.nativeElement.querySelector(
      '.confirm-dialog__confirm',
    ) as HTMLButtonElement;
    confirmButton.click();

    expect(confirmedSpy).toHaveBeenCalledTimes(1);
  });

  it('emits cancelled when cancel button is clicked', () => {
    const fixture = createDialog();
    const cancelledSpy = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelledSpy);

    const cancelButton = fixture.nativeElement.querySelector(
      '.confirm-dialog__cancel',
    ) as HTMLButtonElement;
    cancelButton.click();

    expect(cancelledSpy).toHaveBeenCalledTimes(1);
  });

  it('disables buttons and changes label during processing', () => {
    const fixture = createDialog();
    fixture.componentRef.setInput('isProcessing', true);
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector(
      '.confirm-dialog__confirm',
    ) as HTMLButtonElement;
    const cancelButton = fixture.nativeElement.querySelector(
      '.confirm-dialog__cancel',
    ) as HTMLButtonElement;

    expect(confirmButton.disabled).toBe(true);
    expect(cancelButton.disabled).toBe(true);
    expect(confirmButton.textContent).toContain('Excluindo...');
  });

  it('shows error message with role alert', () => {
    const fixture = createDialog();
    fixture.componentRef.setInput('errorMessage', 'Falha ao excluir produto.');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.confirm-dialog__error') as HTMLElement;
    expect(error.textContent).toContain('Falha ao excluir produto.');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('prevents closing by Escape while processing', () => {
    const fixture = createDialog();
    fixture.componentRef.setInput('isProcessing', true);
    fixture.detectChanges();

    fixture.componentInstance.open();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const cancelEvent = new Event('cancel', { cancelable: true });

    fixture.componentInstance.onDialogCancel(cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(true);
  });

  it('allows closing by Escape when not processing', () => {
    const fixture = createDialog();
    const cancelledSpy = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelledSpy);

    fixture.componentInstance.open();
    const cancelEvent = new Event('cancel', { cancelable: true });
    fixture.componentInstance.onDialogCancel(cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(false);
    expect(cancelledSpy).toHaveBeenCalledTimes(1);
  });
});
