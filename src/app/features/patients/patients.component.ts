// ==========================================
// OWNER: Helda
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Patient } from '../../core/models';
import { SearchInputComponent } from '../../shared/components/search-input.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchInputComponent, ButtonComponent],
  templateUrl: './patients.html',
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading = false;
  isSubmitting = false;
  showForm = false;
  patientForm!: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.loadPatients();
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
    });
  }

  loadPatients(): void {
    this.isLoading = true;
    this.apiService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  onSearch(term: string): void {
    const lower = term.toLowerCase();
    this.filteredPatients = this.patients.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.phone.toLowerCase().includes(lower),
    );
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.patientForm.reset();
    }
  }
  get name() {
    return this.patientForm.get('name');
  }
  get phone() {
    return this.patientForm.get('phone');
  }
}
