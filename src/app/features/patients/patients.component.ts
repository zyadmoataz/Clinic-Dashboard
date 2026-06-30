import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { Patient } from '../../core/models';
import { SearchInputComponent } from '../../shared/components/search-input.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { ModalComponent } from '../../shared/components/modal.component';
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
    ModalComponent,
    TranslatePipe,
  ],
  templateUrl: './patients.component.html',
})
export class PatientsComponent {
  patients = signal<Patient[]>([]);
  filteredPatients = signal<Patient[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  showForm = signal(false);

  patientForm: FormGroup;

  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  public translate = inject(TranslateService);
  private toast = inject(ToastService);

  constructor() {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+() -]{8,20}$/)]],
      email: ['', [Validators.email]],
    });
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading.set(true);
    this.apiService.getPatients().subscribe({
      next: (patientsResponse) => {
        this.patients.set(patientsResponse);
        this.filteredPatients.set(patientsResponse);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        const errorObj = err as HttpErrorResponse;
        this.toast.error(
          errorObj?.error?.message || this.translate.instant('patients.load_failed'),
          this.translate.instant('common.error'),
        );
        this.isLoading.set(false);
      },
    });
  }

  toggleForm(): void {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
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

    this.isSubmitting.set(true);
    const formValue = this.patientForm.value;

    const requestData = {
      name: formValue.name,
      phone: formValue.phone,
      email: formValue.email || '',
    };

    this.apiService.createPatient(requestData).subscribe({
      next: (newPatient) => {
        this.patients.update((p) => [newPatient, ...p]);
        this.filteredPatients.update((p) => [newPatient, ...p]);
        this.isSubmitting.set(false);
        this.patientForm.reset();
        this.showForm.set(false);
        this.toast.success(
          this.translate.instant('patients.created_success'),
          this.translate.instant('common.success'),
        );
      },
      error: (err: unknown) => {
        console.error(err);
        const errorObj = err as HttpErrorResponse;
        const message =
          errorObj?.error?.details?.[0] ||
          errorObj?.error?.message ||
          this.translate.instant('patients.create_failed');

        this.toast.error(message, this.translate.instant('common.error'));
        this.isSubmitting.set(false);
      },
    });
  }

  onSearch(term: string): void {
    const lower = term.toLowerCase();
    this.filteredPatients.set(
      this.patients().filter(
        (p) => p.name.toLowerCase().includes(lower) || p.phone.toLowerCase().includes(lower),
      ),
    );
  }

  get tableColumns() {
    return ['patients.name', 'patients.phone', 'patients.email', 'patients.account'];
  }

  get tableData() {
    return this.filteredPatients().map((p) => ({
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
  get email() {
    return this.patientForm.get('email')!;
  }
}
