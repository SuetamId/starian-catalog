import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilteredEmptyState } from './filtered-empty-state';

describe('FilteredEmptyState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilteredEmptyState],
    });
  });

  it('renders default copy', () => {
    const fixture = TestBed.createComponent(FilteredEmptyState);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nenhum produto corresponde');
    expect(fixture.nativeElement.textContent).toContain('Limpar filtros');
  });

  it('renders custom copy', () => {
    const fixture = TestBed.createComponent(FilteredEmptyState);
    fixture.componentRef.setInput('title', 'Custom title');
    fixture.componentRef.setInput('message', 'Custom message');
    fixture.componentRef.setInput('clearLabel', 'Reset');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Custom title');
    expect(fixture.nativeElement.textContent).toContain('Custom message');
    expect(fixture.nativeElement.textContent).toContain('Reset');
  });

  it('emits clearFilters when action is clicked', () => {
    const fixture = TestBed.createComponent(FilteredEmptyState);
    fixture.detectChanges();

    const clearSpy = vi.fn();
    fixture.componentInstance.clearFilters.subscribe(clearSpy);

    const button = fixture.nativeElement.querySelector('.filtered-empty-state__action') as HTMLButtonElement;
    button.click();

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
