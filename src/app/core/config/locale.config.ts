import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

export function registerAppLocaleData(): void {
  registerLocaleData(localePt, 'pt-BR');
}
