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
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');

    if (token && userStr) {
      this.isAuthenticated.set(true);
      // We parse the 'userStr', NOT the 'token'
      this.currentUser.set(JSON.parse(userStr));
    }
  }

  setSession(_user: User, _token: string) {
    localStorage.setItem('auth_token', _token);
    localStorage.setItem('current_user', JSON.stringify(_user));
    this.isAuthenticated.set(true);
    this.currentUser.set(_user);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
