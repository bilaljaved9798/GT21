import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Loaderservice } from '../Services/loaderservice';


export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(Loaderservice);
  
  loaderService.show();

  return next(req).pipe(
    finalize(() => loaderService.hide()) // Runs when request finishes or fails
  );
};