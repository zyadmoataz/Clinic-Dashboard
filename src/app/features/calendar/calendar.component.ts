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
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  appointmentsList = signal<Appointment[]>([]);
  loadingStatus = signal<boolean>(false);

  // Slots rendered chronologically by time slot.
  sortedAppointments = computed(() =>
    [...this.appointmentsList()].sort((a, b) => (a.timeSlot || '').localeCompare(b.timeSlot || '')),
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
      next: (appointmentsResponse) => {
        this.appointmentsList.set(appointmentsResponse ?? []);
        this.loadingStatus.set(false);
      },
      error: () => {
        this.appointmentsList.set([]);
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
