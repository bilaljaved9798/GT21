import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './app/interceptor/authInterceptor';
import { loaderInterceptor } from './app/interceptor/loaderInterceptor';

bootstrapApplication(App, { providers: [provideRouter(routes),
  provideHttpClient(withInterceptorsFromDi()),
  provideHttpClient(withFetch()), 
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
}).catch(err => console.error(err));

