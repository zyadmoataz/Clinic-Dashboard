import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-receptionist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-receptionist.html',
})
export class AddReceptionistComponent implements OnInit {
  receptionistForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
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

    this.isLoading = true;
    const formValue = this.receptionistForm.value;

    const data = {
      name: formValue.displayName,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
    };

    this.apiService.addReceptionist(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/staff']);
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
