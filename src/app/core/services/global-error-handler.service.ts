import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  // Modern Angular: 'inject' retrieves ToastrService dynamically without constructor boilerplate
  private toastr = inject(ToastrService);

  handleError(error: any): void {
    // 1. Print the error in the browser console for developers to debug
    console.error('Application Crash Caught:', error);

    // 2. Safely extract a readable error message
    const message = error?.message || 'An unexpected application error occurred.';

    // 3. Display a red error toast notification on the screen
    this.toastr.error(message, 'System Error');
  }
}
