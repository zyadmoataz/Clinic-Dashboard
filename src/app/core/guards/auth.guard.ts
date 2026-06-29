import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.currentUser();
    if (user && user.role.toLowerCase() !== 'patient') {
      return true;
    }
    // If authenticated but it's a patient, log them out or just redirect to login
    authService.logout();
  }
  return router.createUrlTree(['/staff/login']);
};
