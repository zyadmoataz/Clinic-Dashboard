import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/staff/login']);
    }

    const user = authService.currentUser();
    if (user && allowedRoles.includes(user.role.toLowerCase())) {
      return true;
    }

    // Redirect to dashboard if unauthorized
    return router.createUrlTree(['/staff/dashboard']);
  };
}
