// src/app/core/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.uuid) {
    return true; // está logado, libera
  }

  // não logado: manda pro login e guarda o retorno
  router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  return false;
};
