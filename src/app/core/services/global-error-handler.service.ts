import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private toastr = inject(ToastrService);

  handleError(error: any): void {
    console.error('Application Crash Caught:', error);

    const message = error?.message ?? '';

    if (message.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
      return;
    }

    if (!isDevMode()) {
      this.toastr.error(message || 'An unexpected application error occurred.', 'System Error');
    }
  }
}
