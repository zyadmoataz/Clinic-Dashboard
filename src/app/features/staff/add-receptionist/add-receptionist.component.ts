import { Component, inject, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputComponent } from '../../../shared/components/input.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-add-receptionist',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, InputComponent, ButtonComponent],
  templateUrl: './add-receptionist.component.html',
})
export class AddReceptionistComponent {
  receptionistForm: FormGroup;
  isLoading = signal(false);

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  constructor() {
    this.receptionistForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get displayName() {
    return this.receptionistForm.get('displayName');
  }
  get email() {
    return this.receptionistForm.get('email');
  }
  get phone() {
    return this.receptionistForm.get('phone');
  }
  get password() {
    return this.receptionistForm.get('password');
  }

  onSubmit(): void {
    if (this.receptionistForm.invalid) {
      this.receptionistForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.receptionistForm.value;

    const receptionistData = {
      name: formValue.displayName,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
    };

    this.apiService.addReceptionist(receptionistData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success(this.translate.instant('common.success'));
        this.router.navigate(['/staff']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.toast.error(
            this.translate.instant('validation.email_in_use') || 'That email is already in use.',
          );
        } else {
          this.toast.error(this.translate.instant('common.error') || 'An error occurred.');
        }
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
