import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
    ,
  // Proveer HttpClient (y que use los interceptors registrados en DI)
  provideHttpClient(withInterceptorsFromDi()),
    // Registrar interceptor para adjuntar Authorization si hay token
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ,
    { provide: 'API_URL', useValue: environment.HOST }
  ]
};
