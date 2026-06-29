// ==========================================
// OWNER: Zyad
// ==========================================
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { InputComponent } from '../../shared/components/input.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
        next: (res) => {
          if (res.user.role.toLowerCase() === 'patient') {
            this.toastService.error('Access denied', 'Patients cannot access the staff dashboard.');
            return;
          }
          this.authService.setSession(res.user, res.token);
          this.router.navigate(['/staff/dashboard']);
          this.toastService.success('Login successful', 'Welcome back');
        },
        error: (err) => {
          this.toastService.error('Login failed', 'Please check your credentials');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
