import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  FeedbackStatesComponent,
  PageHeaderComponent,
  SelectComponent,
  InputComponent,
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ArabicDigitsPipe } from '../../shared/pipes/arabic-digits.pipe';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Doctor, Service, Slot, WalkInBookingRequest, Patient } from '../../core/models';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-walk-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TranslatePipe,
    LoadingComponent,
    SelectComponent,
    FeedbackStatesComponent,
    ButtonComponent,
    InputComponent,
    LucideAngularModule,
    DatePipe,
    ArabicDigitsPipe,
  ],
  templateUrl: './walk-in.component.html',
})
export class WalkInComponent implements OnInit {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);
  router = inject(Router);
  fb = inject(FormBuilder);

  today = new Date().toISOString().split('T')[0];

  walkInForm!: FormGroup;

  doctors = signal<Doctor[]>([]);
  availableSlots = signal<Slot[]>([]);
  loadingSlots = signal<boolean>(false);
  saving = signal<boolean>(false);

  patientSearchResults = signal<Patient[]>([]);
  showPatientDropdown = signal<boolean>(false);
  selectedPatient = signal<Patient | null>(null);

  private patientSearch$ = new Subject<string>();

  // Services are scoped to the chosen doctor
  serviceOptions = computed<Service[]>(() => {
    const docId = this.walkInForm?.get('selectedDoctorId')?.value;
    const doctor = this.doctors().find((d) => d.id === docId);
    return doctor?.services ?? [];
  });

  doctorsSelectOptions = computed(() =>
    this.doctors().map((d) => ({ value: d.id, label: d.displayName })),
  );

  servicesSelectOptions = computed(() =>
    this.serviceOptions().map((s) => ({ value: s.id.toString(), label: s.name })),
  );

  ngOnInit() {
    this.walkInForm = this.fb.group({
      patientName: ['', [Validators.minLength(2)]],
      patientPhone: ['', [Validators.minLength(6)]],
      selectedDoctorId: ['', Validators.required],
      selectedServiceId: ['', Validators.required],
      selectedDate: [this.today, Validators.required],
      selectedSlot: ['', Validators.required],
    });

    this.loadDoctors();

    this.patientSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim().length < 2) {
            return of([]);
          }
          return this.apiService.getPatients({ search: query }).pipe(catchError(() => of([])));
        }),
      )
      .subscribe((patients) => {
        this.patientSearchResults.set(patients);
        this.showPatientDropdown.set(true);
      });

    this.walkInForm.get('patientName')?.valueChanges.subscribe((name) => {
      if (this.selectedPatient() && this.selectedPatient()?.name !== name) {
        this.selectedPatient.set(null);
        this.walkInForm.get('patientPhone')?.enable();
      }
      this.patientSearch$.next(name || '');
    });

    this.walkInForm.get('selectedDoctorId')?.valueChanges.subscribe(() => {
      this.walkInForm.get('selectedServiceId')?.setValue('', { emitEvent: false });
      this.walkInForm.get('selectedSlot')?.setValue('', { emitEvent: false });
      this.loadSlots();
    });

    this.walkInForm.get('selectedServiceId')?.valueChanges.subscribe(() => {
      this.walkInForm.get('selectedSlot')?.setValue('', { emitEvent: false });
      this.loadSlots();
    });

    this.walkInForm.get('selectedDate')?.valueChanges.subscribe(() => {
      this.walkInForm.get('selectedSlot')?.setValue('', { emitEvent: false });
      this.loadSlots();
    });
  }

  nameError(): string | null {
    const ctrl = this.walkInForm?.get('patientName');
    if (ctrl?.invalid && (ctrl?.dirty || ctrl?.touched)) {
      return this.translateService.instant('walk_in.name_error');
    }
    return null;
  }

  phoneError(): string | null {
    const ctrl = this.walkInForm?.get('patientPhone');
    if (ctrl?.invalid && (ctrl?.dirty || ctrl?.touched)) {
      return this.translateService.instant('walk_in.phone_error');
    }
    return null;
  }

  get canLoadSlots(): boolean {
    const val = this.walkInForm?.value;
    return !!val?.selectedDoctorId && !!val?.selectedDate && !!val?.selectedServiceId;
  }

  get patientNameValue(): string {
    return this.walkInForm?.get('patientName')?.value || '';
  }

  get selectedSlotValue(): string {
    return this.walkInForm?.get('selectedSlot')?.value || '';
  }

  setSlot(time: string) {
    this.walkInForm.get('selectedSlot')?.setValue(time);
  }

  selectPatient(patient: Patient) {
    this.selectedPatient.set(patient);
    this.walkInForm.patchValue(
      {
        patientName: patient.name,
        patientPhone: patient.phone,
      },
      { emitEvent: false },
    );
    this.walkInForm.get('patientPhone')?.disable();
    this.showPatientDropdown.set(false);
  }

  addNewPatient() {
    this.selectedPatient.set(null);
    this.walkInForm.get('patientPhone')?.enable();
    this.showPatientDropdown.set(false);
    this.router.navigate(['/staff/patients']);
  }

  hideDropdown() {
    setTimeout(() => {
      this.showPatientDropdown.set(false);
    }, 200);
  }

  loadDoctors() {
    this.apiService.getDoctors().subscribe({
      next: (doctorsList) => this.doctors.set(doctorsList.items ?? []),
      error: () =>
        this.toastService.error(this.translateService.instant('walk_in.load_doctors_failed')),
    });
  }

  loadSlots() {
    if (!this.canLoadSlots) {
      this.availableSlots.set([]);
      return;
    }

    this.loadingSlots.set(true);

    const formVal = this.walkInForm.value;
    const doctorId = formVal.selectedDoctorId;
    const serviceId = formVal.selectedServiceId || undefined;

    this.apiService.getDoctorSlots(doctorId, { date: formVal.selectedDate, serviceId }).subscribe({
      next: (slotsResponse) => {
        this.availableSlots.set(slotsResponse ?? []);
        this.loadingSlots.set(false);
      },
      error: () => {
        this.availableSlots.set([]);
        this.loadingSlots.set(false);
      },
    });
  }

  submit() {
    if (this.walkInForm.invalid || this.saving()) {
      this.walkInForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formVal = this.walkInForm.getRawValue();

    const payload: WalkInBookingRequest = {
      doctorId: formVal.selectedDoctorId,
      serviceId: Number(formVal.selectedServiceId),
      date: formVal.selectedDate,
      startTime: formVal.selectedSlot,
    };

    if (this.selectedPatient()) {
      payload.patientId = this.selectedPatient()?.id;
    } else {
      payload.newPatient = {
        name: formVal.patientName.trim(),
        phone: formVal.patientPhone.trim(),
      };
    }

    this.apiService.bookWalkIn(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.success(this.translateService.instant('walk_in.book_success'));
        this.resetForm();
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error(this.translateService.instant('walk_in.book_failed'));
      },
    });
  }

  resetForm() {
    this.walkInForm.reset({
      patientName: '',
      patientPhone: '',
      selectedDoctorId: '',
      selectedServiceId: '',
      selectedDate: this.today,
      selectedSlot: '',
    });
    this.walkInForm.get('patientPhone')?.enable();
    this.availableSlots.set([]);
    this.selectedPatient.set(null);
    this.patientSearchResults.set([]);
    this.showPatientDropdown.set(false);
  }
}
