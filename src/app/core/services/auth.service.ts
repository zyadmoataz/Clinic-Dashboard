import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'receptionist' | 'doctor' | 'patient';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Simple signal-based state for authentication
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // TODO: Check local storage for existing session
  }

  setSession(_user: User, _token: string) {
    // TODO: Save to localStorage and update signals
    console.log('setSession called. Team needs to implement this.');
  }

  logout() {
    // TODO: Remove from localStorage and update signals
    console.log('logout called. Team needs to implement this.');
  }
}
