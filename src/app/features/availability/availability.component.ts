// ==========================================
// OWNER: Doaa
// ==========================================
import { Component, inject, signal } from '@angular/core';
import {
  FeedbackStatesComponent,
  PageHeaderComponent,
  SelectComponent,
} from '../../shared/components';
import { TranslatePipe } from '@ngx-translate/core';
import { BlockedDate, Doctor, DoctorAvailability } from '../../core/models';
import { ApiService } from '../../core/services/api.service';
import { LoadingComponent } from '../../shared/components/loading.component';
@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TranslatePipe,
    LoadingComponent,
    SelectComponent,
    FeedbackStatesComponent,
  ],
  template: `
    <app-page-header
      [title]="'header.availability' | translate"
      [description]="'availability.subtitle' | translate"
    ></app-page-header>

    <app-select
      [options]="doctorsArr()"
      labelKey="displayName"
      valueKey="id"
      [placeholder]="'availability.select_doctor' | translate"
      (valueChange)="onDoctorSelect($event)"
    ></app-select>

    @if ((!selectedDoctor() || doctorsArr().length === 0) && !loadingAvailStatus()) {
      <app-feedback-states />
    }

    @if (selectedDoctor()) {
      <div class="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <section class="bg-surface flex-1 rounded-xl p-4">
          <h2 class="mb-3 text-lg font-semibold">{{ 'availability.working_hours' | translate }}</h2>

          @if (loadingAvailStatus()) {
            <app-loading />
          } @else {
            @if (availabilityArr().length === 0) {
              <app-feedback-states
                [showIcon]="false"
                titleKey=""
                descriptionKey="availability.no_working_hours"
              />
            }

            @for (item of availabilityArr(); track item.id) {
              <div class="flex gap-2">
                <span>{{ item.dayOfWeek }}</span>
                <span>{{ item.startTime }} - {{ item.endTime }}</span>
              </div>
            }
          }
        </section>

        <section class="bg-surface flex-1 rounded-xl p-4">
          <h2 class="mb-3 text-lg font-semibold">{{ 'availability.blocked_days' | translate }}</h2>

          @if (loadingBlockedStatus()) {
            <app-loading />
          } @else {
            @if (blockedDatesArr().length === 0) {
              <app-feedback-states
                [showIcon]="false"
                titleKey=""
                descriptionKey="availability.no_blocked_days"
              />
            }

            @for (item of blockedDatesArr(); track item.id) {
              <div class="flex gap-2">
                <span>{{ item.date }}</span>
              </div>
            }
          }
        </section>
      </div>
    }
  `,
})
export class AvailabilityComponent {
  apiService = inject(ApiService);

  doctorsArr = signal<Doctor[]>([]);
  availabilityArr = signal<DoctorAvailability[]>([]);
  blockedDatesArr = signal<BlockedDate[]>([]);

  selectedDoctor = signal<Doctor | null>(null);
  loadingAvailStatus = signal<boolean>(false);
  loadingBlockedStatus = signal<boolean>(false);

  constructor() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.apiService.getDoctors().subscribe({
      next: (resp) => {
        this.doctorsArr.set(resp.items);
      },
    });
  }

  onDoctorSelect(id: string) {
    const doctor = this.doctorsArr().find((d) => d.id === id) ?? null;

    this.selectedDoctor.set(doctor);

    if (doctor) {
      this.loadAvailability(doctor.id);
      this.loadBlockedDates(doctor.id);
    } else {
      this.availabilityArr.set([]);
      this.blockedDatesArr.set([]);
    }
  }

  loadAvailability(doctorId: string) {
    this.loadingAvailStatus.set(true);

    this.apiService.getDoctorAvailability(doctorId).subscribe({
      next: (resp) => {
        this.availabilityArr.set(resp);
        this.loadingAvailStatus.set(false);
      },
      error: () => {
        this.availabilityArr.set([]);
        this.loadingAvailStatus.set(false);
      },
    });
  }

  loadBlockedDates(doctorId: string) {
    this.loadingBlockedStatus.set(true);

    this.apiService.getDoctorBlockedDates(doctorId).subscribe({
      next: (resp) => {
        this.blockedDatesArr.set(resp);
        this.loadingBlockedStatus.set(false);
      },
      error: () => {
        this.blockedDatesArr.set([]);
        this.loadingBlockedStatus.set(false);
      },
    });
  }
}
