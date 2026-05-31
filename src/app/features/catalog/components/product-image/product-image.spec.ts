import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductImage } from './product-image';

describe('ProductImage', () => {
  let observerCallback: IntersectionObserverCallback | null = null;

  beforeEach(() => {
    observerCallback = null;

    class IntersectionObserverMock {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    }

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    TestBed.configureTestingModule({
      imports: [ProductImage],
    });
  });

  function createImage(
    overrides: {
      src?: string;
      alt?: string;
      width?: number;
      height?: number;
      loading?: 'eager' | 'lazy';
      deferUntilVisible?: boolean;
      fetchPriority?: 'high' | 'low' | 'auto';
    } = {},
  ) {
    const fixture = TestBed.createComponent(ProductImage);
    fixture.componentRef.setInput('src', overrides.src ?? 'https://example.com/product.jpg');
    fixture.componentRef.setInput('alt', overrides.alt ?? 'Produto de exemplo');
    if (overrides.width !== undefined) {
      fixture.componentRef.setInput('width', overrides.width);
    }
    if (overrides.height !== undefined) {
      fixture.componentRef.setInput('height', overrides.height);
    }
    if (overrides.loading !== undefined) {
      fixture.componentRef.setInput('loading', overrides.loading);
    }
    if (overrides.deferUntilVisible !== undefined) {
      fixture.componentRef.setInput('deferUntilVisible', overrides.deferUntilVisible);
    }
    if (overrides.fetchPriority !== undefined) {
      fixture.componentRef.setInput('fetchPriority', overrides.fetchPriority);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getImageElement(fixture: ReturnType<typeof createImage>): HTMLImageElement | null {
    return fixture.nativeElement.querySelector('img');
  }

  function triggerIntersection(isIntersecting = true): void {
    observerCallback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  }

  it('renders src', () => {
    const fixture = createImage({ src: 'https://example.com/item.png' });
    const image = getImageElement(fixture);

    expect(image?.getAttribute('src')).toBe('https://example.com/item.png');
  });

  it('renders alt', () => {
    const fixture = createImage({ alt: 'Camiseta azul' });
    const image = getImageElement(fixture);

    expect(image?.getAttribute('alt')).toBe('Camiseta azul');
  });

  it('renders dimensions', () => {
    const fixture = createImage({ width: 56, height: 72 });
    const image = getImageElement(fixture);

    expect(image?.getAttribute('width')).toBe('56');
    expect(image?.getAttribute('height')).toBe('72');
  });

  it('uses loading="lazy" by default', () => {
    const fixture = createImage();
    const image = getImageElement(fixture);

    expect(image?.getAttribute('loading')).toBe('lazy');
  });

  it('accepts loading="eager"', () => {
    const fixture = createImage({ loading: 'eager' });
    const image = getImageElement(fixture);

    expect(image?.getAttribute('loading')).toBe('eager');
  });

  it('uses decoding="async"', () => {
    const fixture = createImage();
    const image = getImageElement(fixture);

    expect(image?.getAttribute('decoding')).toBe('async');
  });

  it('accepts fetchPriority="low"', () => {
    const fixture = createImage({ fetchPriority: 'low' });
    const image = getImageElement(fixture);

    expect(image?.getAttribute('fetchpriority')).toBe('low');
  });

  it('defers image rendering until the element is visible', () => {
    const fixture = createImage({ deferUntilVisible: true });

    expect(getImageElement(fixture)).toBeNull();
    expect(fixture.nativeElement.querySelector('.product-image__placeholder')).toBeTruthy();

    triggerIntersection(true);
    fixture.detectChanges();

    expect(getImageElement(fixture)?.getAttribute('src')).toBe('https://example.com/product.jpg');
  });

  it('replaces broken image with local SVG fallback', () => {
    const fixture = createImage({ src: 'https://example.com/broken.jpg' });
    const image = getImageElement(fixture)!;

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(image.getAttribute('src')).toBe('/images/product-placeholder.svg');
  });

  it('avoids fallback loop when placeholder fails', () => {
    const fixture = createImage({ src: 'https://example.com/broken.jpg' });
    const image = getImageElement(fixture)!;

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(image.getAttribute('src')).toBe('/images/product-placeholder.svg');
  });

  it('updates image when src input changes', () => {
    const fixture = createImage({ src: 'https://example.com/first.jpg' });
    const image = getImageElement(fixture)!;

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(image.getAttribute('src')).toBe('/images/product-placeholder.svg');

    fixture.componentRef.setInput('src', 'https://example.com/second.jpg');
    fixture.detectChanges();

    expect(image.getAttribute('src')).toBe('https://example.com/second.jpg');
  });
});
