import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingState {}
