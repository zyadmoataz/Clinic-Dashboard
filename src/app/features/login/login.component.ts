// ==========================================
// OWNER: Zyad
// ==========================================
import { Component, inject, signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { InputComponent } from '../../shared/components/input.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, LucideAngularModule, ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  showPassword = signal(false);
  loginError = signal<string | null>(null);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  togglePassword() {
    this.showPassword.update((show) => !show);
  }

  onSubmit() {
    this.loginError.set(null);
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
        next: (res) => {
          if (res.user.role.toLowerCase() === 'patient') {
            this.toastService.error(
              this.translate.instant('login.access_denied'),
              this.translate.instant('login.patients_no_access'),
            );
            return;
          }
          this.authService.setSession(res.user, res.token);
          this.router.navigate(['/staff/dashboard']);
          this.toastService.success(
            this.translate.instant('login.success'),
            this.translate.instant('login.welcome_back'),
          );
        },
        error: (err) => {
          this.loginError.set(this.translate.instant('login.invalid_credentials'));
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
