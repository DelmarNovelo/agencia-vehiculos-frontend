import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import Aura from '@primeng/themes/aura'
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { definePreset } from '@primeng/themes';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura),
        options: {
          darkModeSelector: '.dark-theme'
        }
      }
    }),
    MessageService,
    DialogService,
  ]
};
