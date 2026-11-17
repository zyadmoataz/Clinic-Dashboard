import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, throwError, TimeoutError } from 'rxjs';
import { catchError, delay, tap, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TransportService } from '../services/transport.service';
import { dispatchStaffMock } from '../mock/clinic-mock.handlers';

let apiBackoffUntil = 0;

function extractApiPath(url: string): string {
  const withoutOrigin = url.replace(/^https?:\/\/[^/]+/, '');
  const idx = withoutOrigin.indexOf('/api/');
  return idx >= 0 ? withoutOrigin.slice(idx + 4).split('?')[0] : withoutOrigin.split('?')[0];
}

function isLocalApiOnRemoteHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  const isRemote = host !== 'localhost' && host !== '127.0.0.1';
  const pointsToLocal =
    environment.apiUrl.includes('localhost') || environment.apiUrl.includes('127.0.0.1');
  return isRemote && pointsToLocal;
}

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  const transport = inject(TransportService);
  const path = extractApiPath(req.url);

  const executeMock = () => {
    transport.source.set('browser-mock');
    try {
      const body = dispatchStaffMock(req, path);
      return of(new HttpResponse({ status: 200, body })).pipe(delay(90));
    } catch (err) {
      return throwError(() => err);
    }
  };

  if (
    environment.dataMode === 'mock' ||
    (environment.dataMode === 'auto' && (isLocalApiOnRemoteHost() || Date.now() < apiBackoffUntil))
  ) {
    return executeMock();
  }

  return next(req).pipe(
    timeout(1200),
    tap(() => transport.source.set('live-api')),
    catchError((error: unknown) => {
      const isNetworkDown =
        error instanceof TimeoutError || (error instanceof HttpErrorResponse && error.status === 0);
      if (environment.dataMode === 'auto' && isNetworkDown) {
        apiBackoffUntil = Date.now() + 15000;
        return executeMock();
      }
      return throwError(() => error);
    }),
  );
};
