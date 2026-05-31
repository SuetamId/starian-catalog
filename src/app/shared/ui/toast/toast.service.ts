import { Injectable, signal } from '@angular/core';

import { ToastMessage, ToastType } from './toast.model';

const AUTO_DISMISS_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastState = signal<ToastMessage | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  readonly toast = this.toastState.asReadonly();

  showSuccess(message: string): void {
    this.show('success', message);
  }

  showError(message: string): void {
    this.show('error', message);
  }

  dismiss(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }

    this.toastState.set(null);
  }

  private show(type: ToastType, message: string): void {
    this.dismiss();
    this.toastState.set({ type, message });
    this.dismissTimer = setTimeout(() => this.dismiss(), AUTO_DISMISS_MS);
  }
}
