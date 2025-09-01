// src/app/core/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const uuid = localStorage.getItem('pp_uuid');
  if (uuid) {
    req = req.clone({
      setHeaders: { uuid }
    });
  }
  return next(req);
};
