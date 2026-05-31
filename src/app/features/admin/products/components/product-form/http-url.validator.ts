import { AbstractControl, ValidationErrors } from '@angular/forms';

export function isValidHttpUrl(value: string): boolean {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function httpUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = typeof control.value === 'string' ? control.value.trim() : '';

  if (!value) {
    return null;
  }

  if (!isValidHttpUrl(value)) {
    return { httpUrl: true };
  }

  return null;
}
