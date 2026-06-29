import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const router = inject(Router);

  const headersConfig: Record<string, string | string[]> = {};

  if (!(req.body instanceof FormData)) {
    headersConfig['Content-Type'] = 'application/json';
  }

  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const cloned = req.clone({ setHeaders: headersConfig });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.error('Unauthorized access - redirecting to login');
        inject(AuthService).logout();
        router.navigate(['/staff/login']);
      }
      return throwError(() => error);
    }),
  );
};
