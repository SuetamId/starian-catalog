import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ProductRating } from './product-rating';

describe('ProductRating', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductRating],
    });
  });

  it('renders rating value and count', () => {
    const fixture = TestBed.createComponent(ProductRating);
    fixture.componentRef.setInput('rate', 4.7);
    fixture.componentRef.setInput('count', 500);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('4,7');
    expect(fixture.nativeElement.textContent).toContain('500 avaliações');
    const rating = fixture.nativeElement.querySelector('.product-rating') as HTMLElement;
    expect(rating.getAttribute('aria-label')).toContain('4.7');
  });

  it('hides count in compact mode', () => {
    const fixture = TestBed.createComponent(ProductRating);
    fixture.componentRef.setInput('rate', 3.9);
    fixture.componentRef.setInput('count', 120);
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('avaliações');
  });
});
