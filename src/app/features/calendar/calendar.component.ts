import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Appointment } from '../../core/models';
import {
  BadgeComponent,
  ButtonComponent,
  FeedbackStatesComponent,
  PageHeaderComponent,
  SelectComponent,
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { RescheduleModalComponent } from './reschedule-modal.component';
import {
  getAppointmentStatusClass,
  getPaymentStatusClass,
} from '../../core/utils/status-style.util';
import { toLocalIsoDate } from '../../core/utils/format.util';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    TranslatePipe,
    LoadingComponent,
    FeedbackStatesComponent,
    BadgeComponent,
    ButtonComponent,
    SelectComponent,
    LucideAngularModule,
    RouterLink,
    RescheduleModalComponent,
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  selectedDate = signal<string>(toLocalIsoDate());
  selectedDoctorId = signal<string>('');
  appointmentsList = signal<Appointment[]>([]);
  doctors = signal<{ id: string; displayName: string }[]>([]);
  loadingStatus = signal<boolean>(false);
  rescheduleTarget = signal<Appointment | null>(null);

  sortedAppointments = computed(() => {
    let list = this.appointmentsList();
    if (this.selectedDoctorId()) {
      list = list.filter((a) => String(a.doctorId) === this.selectedDoctorId());
    }
    return [...list].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  });

  daySummary = computed(() => {
    const items = this.sortedAppointments();
    return {
      total: items.length,
      waiting: items.filter((a) => ['Confirmed', 'PendingPayment'].includes(a.status)).length,
      arrived: items.filter((a) => a.status === 'Arrived').length,
      completed: items.filter((a) => a.status === 'Completed').length,
    };
  });

  doctorsSelectOptions = computed(() => [
    { value: '', label: this.translateService.instant('common.all') || 'All' },
    ...this.doctors().map((d) => ({ value: d.id, label: d.displayName })),
  ]);

  constructor() {
    this.apiService.getDoctors().subscribe({ next: (res) => this.doctors.set(res.items ?? []) });
    this.loadAppointments();
    const timer = setInterval(() => this.loadAppointments(true), 8000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  onDateChange(date: string) {
    this.selectedDate.set(date);
    this.loadAppointments();
  }

  onDoctorChange(doctorId: string) {
    this.selectedDoctorId.set(doctorId);
  }

  loadAppointments(silent = false) {
    const date = this.selectedDate();
    if (!date) return;
    if (!silent) this.loadingStatus.set(true);
    this.apiService.getAppointments({ date }).subscribe({
      next: (res) => {
        this.appointmentsList.set(res ?? []);
        this.loadingStatus.set(false);
      },
      error: () => {
        this.appointmentsList.set([]);
        this.loadingStatus.set(false);
        if (!silent) this.toastService.error(this.translateService.instant('calendar.load_failed'));
      },
    });
  }

  runAction(obs: ReturnType<ApiService['markArrived']>) {
    obs.subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('calendar.action_success'));
        this.loadAppointments(true);
      },
      error: () => this.toastService.error(this.translateService.instant('calendar.action_failed')),
    });
  }

  statusClass = getAppointmentStatusClass;
  paymentClass = getPaymentStatusClass;
}
