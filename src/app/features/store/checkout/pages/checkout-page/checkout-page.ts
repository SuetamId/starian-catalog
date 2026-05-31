import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { CartStoreService } from '../../../cart/store/cart-store.service';

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage implements OnInit {
  protected readonly cart = inject(CartStoreService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isSubmitting = signal(false);

  protected readonly checkoutForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    if (this.cart.isEmpty()) {
      void this.router.navigate(['/store/cart']);
    }
  }

  submitCheckout(): void {
    if (this.checkoutForm.invalid || this.cart.isEmpty()) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.cart.clearCart();
    void this.router.navigate(['/store/order-success']);
  }
}
