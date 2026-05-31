import { bootstrapApplication } from '@angular/platform-browser';
import { registerAppLocaleData } from './app/core/config/locale.config';
import { appConfig } from './app/app.config';
import { App } from './app/app';

registerAppLocaleData();
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
