import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { ToastContainer } from './toast-container';
import { ToastService } from './toast.service';

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ToastContainer],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows success toast', () => {
    const fixture = TestBed.createComponent(ToastContainer);
    const toastService = TestBed.inject(ToastService);

    toastService.showSuccess('Produto criado com sucesso.');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast-container__toast--success') as HTMLElement;
    expect(toast).toBeTruthy();
    expect(toast.getAttribute('role')).toBe('status');
    expect(fixture.nativeElement.textContent).toContain('Produto criado com sucesso.');
  });

  it('shows error toast', () => {
    const fixture = TestBed.createComponent(ToastContainer);
    const toastService = TestBed.inject(ToastService);

    toastService.showError('Não foi possível salvar o produto.');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast-container__toast--error') as HTMLElement;
    expect(toast).toBeTruthy();
    expect(toast.getAttribute('role')).toBe('alert');
  });

  it('closes toast manually', () => {
    const fixture = TestBed.createComponent(ToastContainer);
    const toastService = TestBed.inject(ToastService);

    toastService.showSuccess('Produto atualizado com sucesso.');
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector(
      '.toast-container__close',
    ) as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast-container__toast')).toBeNull();
  });

  it('removes toast automatically', () => {
    const fixture = TestBed.createComponent(ToastContainer);
    const toastService = TestBed.inject(ToastService);

    toastService.showSuccess('Produto excluído com sucesso.');
    fixture.detectChanges();

    vi.advanceTimersByTime(4000);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast-container__toast')).toBeNull();
  });

  it('exposes accessible close label', () => {
    const fixture = TestBed.createComponent(ToastContainer);
    TestBed.inject(ToastService).showError('Não foi possível excluir o produto.');
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector(
      '.toast-container__close',
    ) as HTMLButtonElement;

    expect(closeButton.getAttribute('aria-label')).toBe('Fechar notificação');
  });
});
