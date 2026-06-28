import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const router = inject(Router);

  const headersConfig: { [name: string]: string | string[] } = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const cloned = req.clone({
    setHeaders: headersConfig,
  });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Unauthorized access - redirecting to login');
        localStorage.removeItem('auth_token');
        // Redirect to your login route, update '/login' if necessary
        router.navigate(['/staff/login']);
      }
      return throwError(() => error);
    }),
  );
};
