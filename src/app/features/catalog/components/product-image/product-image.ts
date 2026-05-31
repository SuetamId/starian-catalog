import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.html',
  styleUrl: './product-image.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImage implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly width = input(64);
  readonly height = input(64);
  readonly loading = input<'eager' | 'lazy'>('lazy');
  readonly deferUntilVisible = input(false);
  readonly fetchPriority = input<'high' | 'low' | 'auto'>('auto');

  readonly fallbackSrc = '/images/product-placeholder.svg';

  readonly currentSrc = linkedSignal(() => this.src());
  readonly isVisible = signal(false);

  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      this.setupVisibilityTracking();
    });
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
  }

  onImageError(): void {
    if (this.currentSrc() === this.fallbackSrc) {
      return;
    }

    this.currentSrc.set(this.fallbackSrc);
  }

  private setupVisibilityTracking(): void {
    if (!this.deferUntilVisible()) {
      this.isVisible.set(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.isVisible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.isVisible.set(true);
          this.disconnectObserver();
        }
      },
      { rootMargin: '240px 0px', threshold: 0 },
    );

    this.observer.observe(this.host.nativeElement);
  }

  private disconnectObserver(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
