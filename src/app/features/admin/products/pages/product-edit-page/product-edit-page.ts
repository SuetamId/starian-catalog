import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { NormalizedHttpError } from '../../../../../core/http/http-error.model';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { ProductForm } from '../../components/product-form/product-form';
import { ApiProduct, CreateProductPayload, UpdateProductPayload } from '../../../../catalog/models/product.model';
import { ProductStoreService } from '../../store/product-store.service';
import { ErrorState } from '../../../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../../../shared/ui/loading-state/loading-state';

@Component({
  selector: 'app-product-edit-page',
  imports: [ErrorState, LoadingState, ProductForm],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditPage implements OnInit {
  protected readonly store = inject(ProductStoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);

  protected readonly product = signal<ApiProduct | null>(null);
  protected readonly isResolving = signal(true);
  protected readonly resolveError = signal<string | null>(null);
  protected readonly productId = signal<number | null>(null);

  protected readonly initialValue = computed<CreateProductPayload | null>(() => {
    const currentProduct = this.product();

    if (!currentProduct) {
      return null;
    }

    return {
      title: currentProduct.title,
      price: currentProduct.price,
      description: currentProduct.description,
      category: currentProduct.category,
      image: currentProduct.image,
    };
  });

  protected readonly categoriesErrorMessage = computed(
    () => this.store.categoriesError()?.message ?? null,
  );

  protected readonly submitErrorMessage = computed(
    () => this.store.updateError()?.message ?? null,
  );

  ngOnInit(): void {
    this.store.clearUpdateError();
    this.ensureCategoriesLoaded();
    this.resolveProduct();
  }

  retryResolveProduct(): void {
    this.resolveProduct();
  }

  onSave(payload: UpdateProductPayload): void {
    const id = this.productId();

    if (id === null) {
      return;
    }

    this.store.clearUpdateError();

    this.store
      .updateProduct(id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.showSuccess('Produto atualizado com sucesso.');
          void this.router.navigate(['/admin/products']);
        },
        error: () => {
          this.toast.showError('Não foi possível salvar o produto.');
        },
      });
  }

  onCancel(): void {
    void this.router.navigate(['/admin/products']);
  }

  retryCategories(): void {
    this.store.loadCategories();
  }

  private ensureCategoriesLoaded(): void {
    this.store.ensureCategoriesLoaded();
  }

  private resolveProduct(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
      this.isResolving.set(false);
      this.resolveError.set('Identificador de produto inválido.');
      this.product.set(null);
      this.productId.set(null);
      return;
    }

    this.productId.set(id);
    this.isResolving.set(true);
    this.resolveError.set(null);
    this.product.set(null);

    this.store
      .resolveProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resolvedProduct) => {
          this.product.set(resolvedProduct);
          this.isResolving.set(false);
        },
        error: (error: NormalizedHttpError) => {
          this.resolveError.set(error.message);
          this.isResolving.set(false);
        },
      });
  }
}
