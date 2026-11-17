import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export type StaffTransportSource = 'live-api' | 'browser-mock';

@Injectable({ providedIn: 'root' })
export class TransportService {
  source = signal<StaffTransportSource>(
    environment.dataMode === 'mock' ? 'browser-mock' : 'live-api',
  );
  isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.isOnline.set(true));
      window.addEventListener('offline', () => this.isOnline.set(false));
    }
  }
}
