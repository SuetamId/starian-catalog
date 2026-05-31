import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { CategoryChip } from './category-chip';

describe('CategoryChip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CategoryChip],
    });
  });

  it('renders translated category label', () => {
    const fixture = TestBed.createComponent(CategoryChip);
    fixture.componentRef.setInput('category', 'electronics');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Eletrônicos');
  });

  it('renders fallback label when category is not provided', () => {
    const fixture = TestBed.createComponent(CategoryChip);
    fixture.componentRef.setInput('label', 'Categoria');
    fixture.componentRef.setInput('muted', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Categoria');
    expect(fixture.nativeElement.querySelector('.category-chip--muted')).toBeTruthy();
  });
});
