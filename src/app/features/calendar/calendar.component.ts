// ==========================================
// OWNER: Omar
// PURPOSE: Receptionist day calendar — list appointment slots for a chosen day.
// API: GET /api/appointments
// ==========================================
import { Component, computed, inject, signal } from '@angular/core';
import {
  BadgeComponent,
  ButtonComponent,
  FeedbackStatesComponent,
  PageHeaderComponent,
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Appointment } from '../../core/models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TranslatePipe,
    LoadingComponent,
    FeedbackStatesComponent,
    BadgeComponent,
    ButtonComponent,
    LucideAngularModule,
    RouterLink,
  ],
  template: `
    <app-page-header
      [title]="'header.calendar' | translate"
      [description]="'calendar.subtitle' | translate"
    >
      <app-button routerLink="/staff/walk-in">
        + {{ 'calendar.new_walk_in' | translate }}
      </app-button>
    </app-page-header>

    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-1">
        <label class="text-muted text-sm font-medium">{{ 'calendar.pick_date' | translate }}</label>
        <input
          type="date"
          [value]="selectedDate()"
          (input)="onDateChange($any($event.target).value)"
          class="border-border bg-surface text-text focus:border-primary focus:ring-primary rounded-lg border px-3 py-2 focus:ring-1 focus:outline-none"
        />
      </div>

      <div class="bg-surface border-border flex items-center gap-2 rounded-lg border px-4 py-2">
        <lucide-icon name="calendar" class="text-primary h-5 w-5"></lucide-icon>
        <span class="text-text text-sm font-medium">
          {{ appointmentsArr().length }} {{ 'calendar.appointments' | translate }}
        </span>
      </div>
    </div>

    @if (loadingStatus()) {
      <app-loading />
    } @else if (appointmentsArr().length === 0) {
      <app-feedback-states
        titleKey="calendar.empty_title"
        descriptionKey="calendar.empty_description"
      />
    } @else {
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (appt of sortedAppointments(); track appt.id) {
          <article class="border-border bg-surface flex flex-col gap-3 rounded-xl border p-4">
            <div class="flex items-start justify-between">
              <div class="text-primary flex items-center gap-2 text-lg font-bold">
                <lucide-icon name="clock" class="h-5 w-5"></lucide-icon>
                <span>{{ appt.timeSlot }}</span>
              </div>
              <app-badge [customClass]="statusClass(appt.status)">
                {{ 'calendar.status.' + appt.status | translate }}
              </app-badge>
            </div>

            <div class="flex flex-col gap-1">
              <p class="text-text flex items-center gap-2 font-semibold">
                <lucide-icon name="contact" class="text-muted h-4 w-4"></lucide-icon>
                {{ appt.patientName || ('calendar.unknown_patient' | translate) }}
              </p>
              <p class="text-muted flex items-center gap-2 text-sm">
                <lucide-icon name="stethoscope" class="h-4 w-4"></lucide-icon>
                {{ appt.doctorName || ('calendar.unknown_doctor' | translate) }}
              </p>
              <p class="text-muted flex items-center gap-2 text-sm">
                <lucide-icon name="activity" class="h-4 w-4"></lucide-icon>
                {{ appt.serviceName || ('calendar.unknown_service' | translate) }}
              </p>
            </div>
          </article>
        }
      </div>
    }
  `,
})
export class CalendarComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  appointmentsArr = signal<Appointment[]>([]);
  loadingStatus = signal<boolean>(false);

  // Slots rendered chronologically by time slot.
  sortedAppointments = computed(() =>
    [...this.appointmentsArr()].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)),
  );

  constructor() {
    this.loadAppointments();
  }

  onDateChange(date: string) {
    this.selectedDate.set(date);
    this.loadAppointments();
  }

  loadAppointments() {
    const date = this.selectedDate();
    if (!date) return;

    this.loadingStatus.set(true);

    this.apiService.getAppointments({ date }).subscribe({
      next: (resp) => {
        this.appointmentsArr.set(resp ?? []);
        this.loadingStatus.set(false);
      },
      error: () => {
        this.appointmentsArr.set([]);
        this.loadingStatus.set(false);
        this.toastService.error(this.translateService.instant('calendar.load_failed'));
      },
    });
  }

  statusClass(status: Appointment['status']): string {
    const map: Record<Appointment['status'], string> = {
      PendingPayment: 'bg-warning-soft text-warning',
      Confirmed: 'bg-primary-soft text-primary',
      Arrived: 'bg-success-soft text-success',
      Completed: 'bg-success-soft text-success',
      NoShow: 'bg-danger-soft text-danger',
      Cancelled: 'bg-danger-soft text-danger',
    };
    return map[status] ?? 'bg-primary-soft text-primary';
  }
}
