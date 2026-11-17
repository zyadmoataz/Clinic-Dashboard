import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const token = authService.getToken();

  const headersConfig: Record<string, string | string[]> = {
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (!(req.body instanceof FormData)) {
    headersConfig['Content-Type'] = 'application/json';
  }

  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const cloned = req.clone({ setHeaders: headersConfig });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        authService.logout();
        router.navigate(['/staff/login']);
      } else if (error.status === 403) {
        toast.error('You do not have permission for this action.', 'Access Denied');
      }
      return throwError(() => error);
    }),
  );
};
