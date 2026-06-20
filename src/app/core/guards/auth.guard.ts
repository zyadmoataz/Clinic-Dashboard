import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // STARTING TEMPLATE: We bypass the guard so you can see the dashboard UI.
  // TODO (Zyad): Once login is implemented, change this back to check authService.isAuthenticated()
  return true;

  /*
  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/staff/auth']);
  */
};
