import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateProductPayload } from '../../../../catalog/models/product.model';
import { ProductForm } from './product-form';

describe('ProductForm', () => {
  const categories = ['electronics', 'jewelery'];

  const validPayload: CreateProductPayload = {
    title: 'New Backpack',
    price: 99.9,
    description: 'A valid product description.',
    category: 'electronics',
    image: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductForm],
    });
  });

  function createComponent() {
    const fixture = TestBed.createComponent(ProductForm);
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();
    return fixture;
  }

  it('renders form fields with associated labels', () => {
    const fixture = createComponent();

    expect(fixture.nativeElement.querySelector('label[for="product-title"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('label[for="product-price"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('label[for="product-category"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('label[for="product-image"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('label[for="product-description"]')).toBeTruthy();
  });

  it('starts invalid before user input', () => {
    const fixture = createComponent();

    expect(fixture.componentInstance.form.invalid).toBe(true);
  });

  it('requires title', () => {
    const fixture = createComponent();
    const title = fixture.componentInstance.form.controls.title;

    title.setValue('');
    title.markAsTouched();

    expect(title.errors?.['required']).toBeTruthy();
  });

  it('requires title with minimum length', () => {
    const fixture = createComponent();
    const title = fixture.componentInstance.form.controls.title;

    title.setValue('ab');
    title.markAsTouched();

    expect(title.errors?.['minlength']).toBeTruthy();
  });

  it('requires price greater than zero', () => {
    const fixture = createComponent();
    const price = fixture.componentInstance.form.controls.price;

    price.setValue(0);
    price.markAsTouched();

    expect(price.errors?.['greaterThanZero']).toBeTruthy();
  });

  it('requires category', () => {
    const fixture = createComponent();
    const category = fixture.componentInstance.form.controls.category;

    category.setValue('');
    category.markAsTouched();

    expect(category.errors?.['required']).toBeTruthy();
  });

  it('accepts valid HTTP image URL', () => {
    const fixture = createComponent();
    const image = fixture.componentInstance.form.controls.image;

    image.setValue('http://example.com/image.jpg');
    image.markAsTouched();

    expect(image.errors).toBeNull();
  });

  it('accepts valid HTTPS image URL', () => {
    const fixture = createComponent();
    const image = fixture.componentInstance.form.controls.image;

    image.setValue('https://example.com/image.jpg');
    image.markAsTouched();

    expect(image.errors).toBeNull();
  });

  it('rejects invalid image protocol', () => {
    const fixture = createComponent();
    const image = fixture.componentInstance.form.controls.image;

    image.setValue('javascript:alert(1)');
    image.markAsTouched();

    expect(image.errors?.['httpUrl']).toBeTruthy();
  });

  it('requires description with minimum length', () => {
    const fixture = createComponent();
    const description = fixture.componentInstance.form.controls.description;

    description.setValue('short');
    description.markAsTouched();

    expect(description.errors?.['minlength']).toBeTruthy();
  });

  it('marks all fields as touched when submitting invalid form', () => {
    const fixture = createComponent();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(fixture.componentInstance.form.controls.title.touched).toBe(true);
    expect(fixture.componentInstance.form.controls.price.touched).toBe(true);
  });

  it('emits save with valid payload', () => {
    const fixture = createComponent();
    const saveSpy = vi.fn();
    fixture.componentInstance.save.subscribe(saveSpy);

    fixture.componentInstance.form.setValue(validPayload);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(saveSpy).toHaveBeenCalledWith(validPayload);
  });

  it('does not clear values after submit', () => {
    const fixture = createComponent();

    fixture.componentInstance.form.setValue(validPayload);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(fixture.componentInstance.form.getRawValue()).toEqual(validPayload);
  });

  it('disables submit while saving', () => {
    const fixture = createComponent();
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      '.product-form__submit',
    ) as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toContain('Salvando...');
  });

  it('shows submit error message', () => {
    const fixture = createComponent();
    fixture.componentRef.setInput('submitError', 'Falha ao salvar produto.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Falha ao salvar produto.');
  });

  it('fills initial values for edit mode', () => {
    const fixture = createComponent();
    fixture.componentRef.setInput('initialValue', validPayload);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.getRawValue()).toEqual(validPayload);

    const priceInput = fixture.nativeElement.querySelector('#product-price') as HTMLInputElement;
    expect(priceInput.value).toContain('99,90');
  });

  it('applies BRL mask while typing price', () => {
    const fixture = createComponent();
    const priceInput = fixture.nativeElement.querySelector('#product-price') as HTMLInputElement;

    priceInput.value = '9990';
    priceInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls.price.value).toBe(99.9);
    expect(priceInput.value).toContain('99,90');
  });

  it('shows placeholder preview for empty image URL', () => {
    const fixture = createComponent();

    fixture.componentInstance.form.controls.image.setValue('');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.product-form__preview-image img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('/images/product-placeholder.svg');
  });

  it('shows placeholder preview for invalid image URL', () => {
    const fixture = createComponent();

    fixture.componentInstance.form.controls.image.setValue('not-a-url');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.product-form__preview-image img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('/images/product-placeholder.svg');
  });

  it('updates preview when image URL becomes valid', () => {
    const fixture = createComponent();

    fixture.componentInstance.form.controls.image.setValue('https://example.com/preview.jpg');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.product-form__preview-image img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('https://example.com/preview.jpg');
  });

  it('uses fallback when preview image fails to load', () => {
    const fixture = createComponent();

    fixture.componentInstance.form.controls.image.setValue('https://example.com/broken.jpg');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.product-form__preview-image img') as HTMLImageElement;
    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(image.getAttribute('src')).toBe('/images/product-placeholder.svg');
  });

  it('updates preview when initialValue changes in edit mode', () => {
    const fixture = createComponent();
    fixture.componentRef.setInput('initialValue', validPayload);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.product-form__preview-image img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe(validPayload.image);
  });
});
