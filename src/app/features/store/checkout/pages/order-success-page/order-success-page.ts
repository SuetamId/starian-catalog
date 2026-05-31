import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success-page',
  imports: [RouterLink],
  templateUrl: './order-success-page.html',
  styleUrl: './order-success-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSuccessPage {}
