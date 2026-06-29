import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-doctor.component.html',
})
export class AddDoctorComponent implements OnInit {
  doctorForm!: FormGroup;
  isLoading = false;

  days = [
    { label: 'Sunday', value: 'Sunday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      // Account
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      specialty: ['', [Validators.required]],
      photoUrl: [''],
      bio: [''],

      // Weekly Availability — FormArray
      availability: this.fb.array([this.createAvailabilityWindow()]),
    });
  }

  // ── Availability FormArray ──
  get availability(): FormArray {
    return this.doctorForm.get('availability') as FormArray;
  }

  createAvailabilityWindow(): FormGroup {
    return this.fb.group({
      dayOfWeek: ['Sunday', Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['17:00', Validators.required],
    });
  }
  addWindow(): void {
    this.availability.push(this.createAvailabilityWindow());
  }

  removeWindow(index: number): void {
    this.availability.removeAt(index);
  }

  get displayName() {
    return this.doctorForm.get('displayName');
  }
  get email() {
    return this.doctorForm.get('email');
  }
  get phone() {
    return this.doctorForm.get('phone');
  }
  get password() {
    return this.doctorForm.get('password');
  }
  get specialty() {
    return this.doctorForm.get('specialty');
  }

  // ── Submit ──
  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.doctorForm.value;

    const doctorData = {
      name: formValue.displayName,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      specialization: formValue.specialty,
      photoUrl: formValue.photoUrl || undefined,
      bio: formValue.bio || undefined,
      availability: formValue.availability.map(
        (a: { dayOfWeek: string; startTime: string; endTime: string }) => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
        }),
      ),
    };

    this.apiService.addDoctor(doctorData).subscribe({
      next: () => {
        this.isLoading = false;
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
        this.isLoading = false;
      },
    });
  }
}
