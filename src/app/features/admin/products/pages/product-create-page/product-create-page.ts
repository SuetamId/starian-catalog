import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { CreateProductPayload } from '../../../../catalog/models/product.model';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductStoreService } from '../../store/product-store.service';

@Component({
  selector: 'app-product-create-page',
  imports: [ProductForm],
  templateUrl: './product-create-page.html',
  styleUrl: './product-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCreatePage implements OnInit {
  protected readonly store = inject(ProductStoreService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);

  protected readonly categoriesErrorMessage = computed(
    () => this.store.categoriesError()?.message ?? null,
  );

  protected readonly submitErrorMessage = computed(
    () => this.store.createError()?.message ?? null,
  );

  ngOnInit(): void {
    this.store.clearCreateError();
    this.ensureCategoriesLoaded();
  }

  onSave(payload: CreateProductPayload): void {
    this.store.clearCreateError();

    this.store
      .createProduct(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.showSuccess('Produto criado com sucesso.');
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
}
