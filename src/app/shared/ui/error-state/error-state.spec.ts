import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('renders the provided message', () => {
    TestBed.configureTestingModule({
      imports: [ErrorState],
    });

    const fixture = TestBed.createComponent(ErrorState);
    fixture.componentRef.setInput('message', 'Falha ao carregar produtos.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Falha ao carregar produtos.');
  });

  it('emits retry when the button is clicked', () => {
    TestBed.configureTestingModule({
      imports: [ErrorState],
    });

    const fixture = TestBed.createComponent(ErrorState);
    fixture.componentRef.setInput('message', 'Erro.');
    fixture.detectChanges();

    const retrySpy = vi.fn();
    fixture.componentInstance.retry.subscribe(retrySpy);

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(retrySpy).toHaveBeenCalledTimes(1);
  });
});
