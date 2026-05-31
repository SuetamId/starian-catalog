import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductFilters } from './product-filters';

describe('ProductFilters', () => {
  const categories = ['electronics', 'jewelery'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductFilters],
    });
  });

  it('renders search field with label', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label[for="product-filters-search"]');
    const input = fixture.nativeElement.querySelector('#product-filters-search');

    expect(label?.textContent).toContain('Buscar produtos');
    expect(input).toBeTruthy();
    expect(input?.getAttribute('type')).toBe('search');
  });

  it('uses custom field id prefix', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.componentRef.setInput('fieldIdPrefix', 'store-filters');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#store-filters-search')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#store-filters-category')).toBeTruthy();
  });

  it('renders category select with label and options', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label[for="product-filters-category"]');
    const select = fixture.nativeElement.querySelector('#product-filters-category') as HTMLSelectElement;

    expect(label?.textContent).toContain('Categoria');
    expect(select).toBeTruthy();
    expect(select.options.length).toBe(categories.length + 1);
    expect(select.options[0].textContent).toContain('Todas as categorias');
    expect(select.options[1].value).toBe('electronics');
    expect(select.options[1].textContent).toContain('Eletrônicos');
  });

  it('emits searchTermChange when typing in the search field', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();

    const searchSpy = vi.fn();
    fixture.componentInstance.searchTermChange.subscribe(searchSpy);

    const input = fixture.nativeElement.querySelector('#product-filters-search') as HTMLInputElement;
    input.value = 'backpack';
    input.dispatchEvent(new Event('input'));

    expect(searchSpy).toHaveBeenCalledWith('backpack');
  });

  it('emits selectedCategoryChange when selecting a category', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();

    const categorySpy = vi.fn();
    fixture.componentInstance.selectedCategoryChange.subscribe(categorySpy);

    const select = fixture.nativeElement.querySelector('#product-filters-category') as HTMLSelectElement;
    select.value = 'jewelery';
    select.dispatchEvent(new Event('change'));

    expect(categorySpy).toHaveBeenCalledWith('jewelery');
  });

  it('emits null when selecting all categories', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.componentRef.setInput('selectedCategory', 'electronics');
    fixture.detectChanges();

    const categorySpy = vi.fn();
    fixture.componentInstance.selectedCategoryChange.subscribe(categorySpy);

    const select = fixture.nativeElement.querySelector('#product-filters-category') as HTMLSelectElement;
    select.value = '';
    select.dispatchEvent(new Event('change'));

    expect(categorySpy).toHaveBeenCalledWith(null);
  });

  it('shows clear button only when filters are active', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.product-filters__clear')).toBeNull();

    fixture.componentRef.setInput('searchTerm', 'ring');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.product-filters__clear')).toBeTruthy();
  });

  it('emits clearFilters when clear button is clicked', () => {
    const fixture = TestBed.createComponent(ProductFilters);
    fixture.componentRef.setInput('categories', categories);
    fixture.componentRef.setInput('searchTerm', 'ring');
    fixture.detectChanges();

    const clearSpy = vi.fn();
    fixture.componentInstance.clearFilters.subscribe(clearSpy);

    const button = fixture.nativeElement.querySelector('.product-filters__clear') as HTMLButtonElement;
    button.click();

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
