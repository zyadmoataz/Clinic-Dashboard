import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { BrandLogoComponent } from '../../shared/components/brand-logo.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    LucideAngularModule,
    ReactiveFormsModule,
    BrandLogoComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
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

  demoAccounts = [
    { role: 'Admin', email: 'admin@medoraclinics.com', password: 'Password123' },
    { role: 'Receptionist', email: 'receptionist@medoraclinics.com', password: 'Password123' },
    { role: 'Doctor (Dr. Sarah)', email: 'dr.sarah@medoraclinics.com', password: 'Password123' },
  ];

  loginAsDemo(email: string, password: string) {
    this.loginForm.setValue({ email, password });
    this.onSubmit();
  }

  onSubmit() {
    this.loginError.set(null);
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.apiService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
      next: (authResponse) => {
        if (authResponse.user.role.toLowerCase() === 'patient') {
          this.toastService.error(
            this.translate.instant('login.access_denied'),
            this.translate.instant('login.patients_no_access'),
          );
          return;
        }
        this.authService.setSession(authResponse.user, authResponse.token);
        const dest =
          authResponse.user.role.toLowerCase() === 'doctor'
            ? '/staff/schedule'
            : '/staff/dashboard';
        this.router.navigate([dest]);
        this.toastService.success(
          this.translate.instant('login.success'),
          this.translate.instant('login.welcome_back'),
        );
      },
      error: () => {
        this.loginError.set(this.translate.instant('login.invalid_credentials'));
      },
    });
  }
}
