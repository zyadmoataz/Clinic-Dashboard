// ==========================================
// OWNER: Helda
// ==========================================
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { Patient } from '../../core/models';
import { SearchInputComponent } from '../../shared/components/search-input.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchInputComponent,
    ButtonComponent,
    InputComponent,
    DataTableComponent,
    TranslatePipe,
  ],
  templateUrl: './patients.component.html',
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
    public translate: TranslateService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
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
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.toast.error(
          err?.error?.message || this.translate.instant('patients.load_failed'),
          this.translate.instant('common.error'),
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.patientForm.reset();
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();

      this.toast.error(
        this.translate.instant('patients.fill_required'),
        this.translate.instant('common.error'),
      );

      return;
    }

    this.isSubmitting = true;
    const formValue = this.patientForm.value;

    const data = {
      name: formValue.name,
      phone: formValue.phone,
      email: formValue.email || '',
    };

    this.apiService.createPatient(data).subscribe({
      next: (newPatient) => {
        this.patients = [newPatient, ...this.patients];
        this.filteredPatients = [newPatient, ...this.filteredPatients];
        this.isSubmitting = false;
        this.patientForm.reset();
        this.showForm = false;
        this.toast.success(
          this.translate.instant('patients.created_success'),
          this.translate.instant('common.success'),
        );
      },
      error: (err: any) => {
        console.error(err);
        const message =
          err?.error?.details?.[0] ||
          err?.error?.message ||
          this.translate.instant('patients.create_failed');

        this.toast.error(message, this.translate.instant('common.error'));
        this.isSubmitting = false;
      },
    });
  }

  onSearch(term: string): void {
    const lower = term.toLowerCase();
    this.filteredPatients = this.patients.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.phone.toLowerCase().includes(lower),
    );
  }

  get tableColumns() {
    return ['patients.name', 'patients.phone', 'patients.email', 'patients.account'];
  }

  get tableData() {
    return this.filteredPatients.map((p) => ({
      id: p.id,
      cells: [
        p.name,
        p.phone,
        p.email,
        p.email?.includes('clinic.local')
          ? this.translate.instant('patients.walk_in')
          : this.translate.instant('patients.registered'),
      ],
    }));
  }

  get name() {
    return this.patientForm.get('name')!;
  }
  get phone() {
    return this.patientForm.get('phone')!;
  }
}
