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
  template: `
    <app-page-header
      [title]="'header.walk_in' | translate"
      [description]="'walk_in.subtitle' | translate"
    ></app-page-header>

    <form
      (submit)="$event.preventDefault(); submit()"
      class="border-border bg-surface mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border p-6"
    >
      <!-- Patient details -->
      <fieldset class="flex flex-col gap-4">
        <legend class="text-text mb-2 flex items-center gap-2 text-lg font-semibold">
          <lucide-icon name="contact" class="text-primary h-5 w-5"></lucide-icon>
          {{ 'walk_in.patient_details' | translate }}
        </legend>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-muted text-sm font-medium">
              {{ 'walk_in.patient_name' | translate }}
            </label>
            <input
              type="text"
              [value]="patientName()"
              (input)="patientName.set($any($event.target).value)"
              [placeholder]="'walk_in.patient_name' | translate"
              class="border-border bg-surface text-text focus:border-primary focus:ring-primary rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-muted text-sm font-medium">
              {{ 'walk_in.patient_phone' | translate }}
            </label>
            <input
              type="tel"
              [value]="patientPhone()"
              (input)="patientPhone.set($any($event.target).value)"
              [placeholder]="'walk_in.patient_phone' | translate"
              class="border-border bg-surface text-text focus:border-primary focus:ring-primary rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            />
          </div>
        </div>
      </fieldset>

      <!-- Booking details -->
      <fieldset class="flex flex-col gap-4">
        <legend class="text-text mb-2 flex items-center gap-2 text-lg font-semibold">
          <lucide-icon name="stethoscope" class="text-primary h-5 w-5"></lucide-icon>
          {{ 'walk_in.booking_details' | translate }}
        </legend>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-muted text-sm font-medium">
              {{ 'walk_in.doctor' | translate }}
            </label>
            <app-select
              [options]="doctorsArr()"
              labelKey="displayName"
              valueKey="id"
              [selectedValue]="selectedDoctorId()"
              [placeholder]="'walk_in.select_doctor' | translate"
              (valueChange)="onDoctorSelect($event)"
            ></app-select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-muted text-sm font-medium">
              {{ 'walk_in.service' | translate }}
            </label>
            <app-select
              [options]="serviceOptions()"
              labelKey="name"
              valueKey="id"
              [selectedValue]="selectedServiceId()"
              [placeholder]="'walk_in.select_service' | translate"
              [disabled]="!selectedDoctorId()"
              (valueChange)="onServiceSelect($event)"
            ></app-select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-muted text-sm font-medium">
              {{ 'walk_in.date' | translate }}
            </label>
            <input
              type="date"
              [value]="selectedDate()"
              [min]="today"
              (input)="onDateChange($any($event.target).value)"
              class="border-border bg-surface text-text focus:border-primary focus:ring-primary rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            />
          </div>
        </div>

        <!-- Slots -->
        <div class="flex flex-col gap-2">
          <label class="text-muted text-sm font-medium">
            {{ 'walk_in.time_slot' | translate }}
          </label>

          @if (loadingSlots()) {
            <app-loading />
          } @else if (!canLoadSlots()) {
            <p class="text-muted text-sm">{{ 'walk_in.pick_doctor_first' | translate }}</p>
          } @else if (slotsArr().length === 0) {
            <app-feedback-states [showIcon]="false" titleKey="" descriptionKey="walk_in.no_slots" />
          } @else {
            <div class="flex flex-wrap gap-2">
              @for (slot of slotsArr(); track slot.time) {
                <button
                  type="button"
                  [disabled]="!slot.isAvailable"
                  (click)="selectedSlot.set(slot.time)"
                  class="rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  [class.bg-primary]="selectedSlot() === slot.time"
                  [class.text-white]="selectedSlot() === slot.time"
                  [class.border-primary]="selectedSlot() === slot.time"
                  [class.border-border]="selectedSlot() !== slot.time"
                  [class.text-text]="selectedSlot() !== slot.time"
                >
                  {{ slot.time }}
                </button>
              }
            </div>
          }
        </div>
      </fieldset>

      <div class="flex justify-end gap-2">
        <app-button type="submit" [disabled]="!isValid() || saving()">
          <lucide-icon name="door-open" class="me-2 h-4 w-4"></lucide-icon>
          {{ (saving() ? 'walk_in.saving' : 'walk_in.book') | translate }}
        </app-button>
      </div>
    </form>
  `,
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

    const doctorId = Number(this.selectedDoctorId());
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
