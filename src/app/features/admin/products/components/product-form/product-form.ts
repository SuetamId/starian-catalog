import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { startWith } from 'rxjs';

import { CreateProductPayload } from '../../../../catalog/models/product.model';
import { CategoryChip } from '../../../../catalog/components/category-chip/category-chip';
import { ProductImage } from '../../../../catalog/components/product-image/product-image';
import { formatBrlAmount, maskBrlInput, parseBrlAmount } from '../../../../catalog/utils/brl-currency';
import { getCategoryLabel } from '../../../../catalog/utils/category-labels';
import { httpUrlValidator, isValidHttpUrl } from './http-url.validator';

export interface ProductFormValue {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

function greaterThanZeroValidator(control: { value: unknown }) {
  const value = Number(control.value);

  if (Number.isNaN(value) || value <= 0) {
    return { greaterThanZero: true };
  }

  return null;
}

@Component({
  selector: 'app-product-form',
  imports: [CategoryChip, ProductImage, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);

  readonly initialValue = input<CreateProductPayload | null>(null);
  readonly categories = input.required<string[]>();
  readonly categoriesLoading = input(false);
  readonly categoriesError = input<string | null>(null);
  readonly isSaving = input(false);
  readonly submitError = input<string | null>(null);
  readonly submitLabel = input('Salvar produto');

  readonly save = output<CreateProductPayload>();
  // eslint-disable-next-line @angular-eslint/no-output-native -- domain event defined by feature spec
  readonly cancel = output<void>();
  readonly categoriesRetry = output<void>();

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, greaterThanZeroValidator]],
    category: ['', Validators.required],
    image: ['', [Validators.required, httpUrlValidator]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly priceDisplay = signal('');
  protected readonly categoryLabel = getCategoryLabel;

  protected readonly previewImageUrl = computed(() => {
    const image = this.formValue().image?.trim() ?? '';

    if (!isValidHttpUrl(image)) {
      return null;
    }

    return image;
  });

  protected readonly previewTitle = computed(() => {
    const title = this.formValue().title?.trim() ?? '';
    return title || 'Nome do produto';
  });

  protected readonly previewCategory = computed(() => {
    const category = this.formValue().category?.trim() ?? '';
    return category || null;
  });

  protected readonly previewPrice = computed(() => {
    const price = Number(this.formValue().price);
    return Number.isFinite(price) && price > 0 ? price : 0;
  });

  protected readonly previewDescription = computed(() => {
    const description = this.formValue().description?.trim() ?? '';
    return description || 'Descrição do produto aparecerá aqui.';
  });

  constructor() {
    effect(() => {
      const value = this.initialValue();

      if (value) {
        this.form.patchValue(value);
        this.priceDisplay.set(formatBrlAmount(value.price));
      }
    });
  }

  onPriceInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const maskedValue = maskBrlInput(inputElement.value);
    const parsedPrice = parseBrlAmount(maskedValue);

    this.priceDisplay.set(maskedValue);
    this.form.controls.price.setValue(parsedPrice ?? 0);
    inputElement.value = maskedValue;
  }

  onPriceBlur(): void {
    const price = this.form.controls.price.value;

    if (price > 0) {
      this.priceDisplay.set(formatBrlAmount(price));
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSaving()) {
      return;
    }

    this.save.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onCategoriesRetry(): void {
    this.categoriesRetry.emit();
  }

  showError(controlName: keyof ProductFormValue): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  errorId(controlName: keyof ProductFormValue): string {
    return `product-${controlName}-error`;
  }

  getTitleError(): string | null {
    const control = this.form.controls.title;

    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Informe o nome do produto.';
    }

    if (control.errors['minlength']) {
      return 'O nome deve ter pelo menos 3 caracteres.';
    }

    return null;
  }

  getPriceError(): string | null {
    const control = this.form.controls.price;

    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required'] || control.errors['greaterThanZero']) {
      return 'Informe um preço maior que zero.';
    }

    return null;
  }

  getCategoryError(): string | null {
    const control = this.form.controls.category;

    if (!control.touched || !control.errors?.['required']) {
      return null;
    }

    return 'Selecione uma categoria.';
  }

  getImageError(): string | null {
    const control = this.form.controls.image;

    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Informe a URL da imagem.';
    }

    if (control.errors['httpUrl']) {
      return 'Informe uma URL HTTP ou HTTPS válida.';
    }

    return null;
  }

  getDescriptionError(): string | null {
    const control = this.form.controls.description;

    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Informe a descrição do produto.';
    }

    if (control.errors['minlength']) {
      return 'A descrição deve ter pelo menos 10 caracteres.';
    }

    return null;
  }
}
