import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-doctor.html',
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
      photoUrl: formValue.photoUrl,
      bio: formValue.bio,
      yearsExperience: 0,
    };

    this.apiService.addDoctor(doctorData).subscribe({
      next: (doctor) => {
        this.apiService
          .setDoctorAvailability(
            doctor.id,
            formValue.availability.map(
              (a: { dayOfWeek: string; startTime: string; endTime: string }) => ({
                dayOfWeek: a.dayOfWeek,
                startTime: a.startTime,
                endTime: a.endTime,
              }),
            ),
          )
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/staff']);
            },
            error: (err: Error) => {
              console.error(err);
              this.isLoading = false;
            },
          });
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
