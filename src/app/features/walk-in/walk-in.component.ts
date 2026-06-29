// ==========================================
// OWNER: Omar
// PURPOSE: Front-desk walk-in booking — capture patient details, pick a doctor,
//          service, date and available slot, then save the booking.
// API: GET /api/doctors/{id}/slots, POST /api/appointments/walk-in
// ==========================================
import { Component, computed, inject, signal } from '@angular/core';
import {
  ButtonComponent,
  FeedbackStatesComponent,
  PageHeaderComponent,
  SelectComponent,
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Doctor, Service, Slot, WalkInBookingRequest } from '../../core/models';

@Component({
  selector: 'app-walk-in',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TranslatePipe,
    LoadingComponent,
    SelectComponent,
    FeedbackStatesComponent,
    ButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './walk-in.component.html',
})
export class WalkInComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  today = new Date().toISOString().split('T')[0];

  doctorsArr = signal<Doctor[]>([]);
  slotsArr = signal<Slot[]>([]);

  selectedDoctorId = signal<string>('');
  selectedServiceId = signal<string>('');
  selectedDate = signal<string>(this.today);
  selectedSlot = signal<string>('');

  patientName = signal<string>('');
  patientPhone = signal<string>('');

  loadingSlots = signal<boolean>(false);
  saving = signal<boolean>(false);

  // Services are scoped to the chosen doctor (provided by Doaa's catalog on the Doctor model).
  serviceOptions = computed<Service[]>(() => {
    const doctor = this.doctorsArr().find((d) => d.id === this.selectedDoctorId());
    return doctor?.services ?? [];
  });

  canLoadSlots = computed(() => !!this.selectedDoctorId() && !!this.selectedDate());

  isValid = computed(
    () =>
      this.patientName().trim().length > 1 &&
      this.patientPhone().trim().length >= 6 &&
      !!this.selectedDoctorId() &&
      !!this.selectedServiceId() &&
      !!this.selectedDate() &&
      !!this.selectedSlot(),
  );

  constructor() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.apiService.getDoctors().subscribe({
      next: (resp) => this.doctorsArr.set(resp.items ?? []),
      error: () =>
        this.toastService.error(this.translateService.instant('walk_in.load_doctors_failed')),
    });
  }

  onDoctorSelect(id: string) {
    this.selectedDoctorId.set(id);
    this.selectedServiceId.set('');
    this.selectedSlot.set('');
    this.loadSlots();
  }

  onServiceSelect(id: string) {
    this.selectedServiceId.set(id);
    this.selectedSlot.set('');
    this.loadSlots();
  }

  onDateChange(date: string) {
    this.selectedDate.set(date);
    this.selectedSlot.set('');
    this.loadSlots();
  }

  loadSlots() {
    if (!this.canLoadSlots()) {
      this.slotsArr.set([]);
      return;
    }

    this.loadingSlots.set(true);

    const doctorId = this.selectedDoctorId();
    const serviceId = this.selectedServiceId() ? Number(this.selectedServiceId()) : undefined;

    this.apiService.getDoctorSlots(doctorId, { date: this.selectedDate(), serviceId }).subscribe({
      next: (resp) => {
        this.slotsArr.set(resp ?? []);
        this.loadingSlots.set(false);
      },
      error: () => {
        this.slotsArr.set([]);
        this.loadingSlots.set(false);
      },
    });
  }

  submit() {
    if (!this.isValid() || this.saving()) return;

    this.saving.set(true);

    const payload: WalkInBookingRequest = {
      doctorId: Number(this.selectedDoctorId()),
      serviceId: Number(this.selectedServiceId()),
      patientName: this.patientName().trim(),
      patientPhone: this.patientPhone().trim(),
      date: this.selectedDate(),
      timeSlot: this.selectedSlot(),
    };

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
    this.patientName.set('');
    this.patientPhone.set('');
    this.selectedDoctorId.set('');
    this.selectedServiceId.set('');
    this.selectedDate.set(this.today);
    this.selectedSlot.set('');
    this.slotsArr.set([]);
  }
}
