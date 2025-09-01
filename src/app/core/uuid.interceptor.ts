// src/app/core/uuid.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const uuidInterceptor: HttpInterceptorFn = (req, next) => {
  const uuid = localStorage.getItem('pp_uuid');
  // Se tiver uuid da sessão, manda no header Authorization
  if (uuid) {
    req = req.clone({ setHeaders: { Authorization: uuid } });
  }
  return next(req);
};
