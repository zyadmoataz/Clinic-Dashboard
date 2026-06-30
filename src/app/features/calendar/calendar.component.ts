import { Component, computed, inject, signal } from '@angular/core';
import {
  BadgeComponent,
  ButtonComponent,
  FeedbackStatesComponent,
  PageHeaderComponent,
  SelectComponent,
  ModalComponent,
  InputComponent,
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Appointment } from '../../core/models';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { toArabicDigits } from '../../core/utils/format.util';

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
    ModalComponent,
    InputComponent,
    FormsModule,
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  get currentLang(): string {
    const lang =
      typeof this.translateService.currentLang === 'function'
        ? (this.translateService.currentLang as unknown as () => string)()
        : this.translateService.currentLang;
    return lang === 'ar' ? 'ar-EG' : 'en-US';
  }

  get formattedSelectedDate(): string {
    const isArabic = this.currentLang === 'ar-EG';
    const dateStr = this.selectedDate();
    if (!dateStr) return '';
    if (!isArabic) return dateStr;

    const parts = dateStr.split('-');
    const displayStr = parts.length === 3 ? `${parts[1]}/${parts[2]}/${parts[0]}` : dateStr;

    return toArabicDigits(displayStr);
  }

  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedDoctorId = signal<string>('');
  appointmentsList = signal<Appointment[]>([]);
  doctors = signal<{ id: string; displayName: string }[]>([]);
  loadingStatus = signal<boolean>(false);

  // Reschedule state
  today = new Date().toISOString().split('T')[0];
  rescheduleAppointmentId = signal<number | null>(null);
  rescheduleDate = signal<string>(this.today);
  rescheduleSlots = signal<string[]>([]);
  rescheduleSelectedSlot = signal<string>('');
  loadingSlots = signal<boolean>(false);
  rescheduling = signal<boolean>(false);

  // Filter and sort appointments
  sortedAppointments = computed(() => {
    let list = this.appointmentsList();
    if (this.selectedDoctorId()) {
      list = list.filter((a) => a.doctorId.toString() === this.selectedDoctorId());
    }
    return [...list].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  });

  formatTime(time: string | undefined | null): string {
    if (!time) return '';
    const lang =
      typeof this.translateService.currentLang === 'function'
        ? (this.translateService.currentLang as unknown as () => string)()
        : this.translateService.currentLang;
    const isArabic = lang === 'ar';
    if (!isArabic) return time;

    return toArabicDigits(time);
  }

  doctorsSelectOptions = computed(() => [
    { value: '', label: this.translateService.instant('common.all') || 'All' },
    ...this.doctors().map((d) => ({ value: d.id, label: d.displayName })),
  ]);

  constructor() {
    this.loadDoctors();
    this.loadAppointments();
  }

  loadDoctors() {
    this.apiService.getDoctors().subscribe({
      next: (res) => this.doctors.set(res.items ?? []),
    });
  }

  onDateChange(date: string) {
    this.selectedDate.set(date);
    this.loadAppointments();
  }

  onDoctorChange(doctorId: string) {
    this.selectedDoctorId.set(doctorId);
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

  markArrived(id: number) {
    this.apiService.markArrived(id).subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('calendar.action_success'));
        this.loadAppointments();
      },
      error: () => this.toastService.error(this.translateService.instant('calendar.action_failed')),
    });
  }

  markPaid(id: number) {
    this.apiService.markCashPaid(id).subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('calendar.action_success'));
        this.loadAppointments();
      },
      error: () => this.toastService.error(this.translateService.instant('calendar.action_failed')),
    });
  }

  markNoShow(id: number) {
    this.apiService.markNoShow(id).subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('calendar.action_success'));
        this.loadAppointments();
      },
      error: () => this.toastService.error(this.translateService.instant('calendar.action_failed')),
    });
  }

  cancelAppointment(id: number) {
    this.apiService.cancelAppointment(id).subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('calendar.action_success'));
        this.loadAppointments();
      },
      error: () => this.toastService.error(this.translateService.instant('calendar.action_failed')),
    });
  }

  // Reschedule methods
  openRescheduleModal(appt: Appointment) {
    this.rescheduleAppointmentId.set(appt.id);
    this.rescheduleDate.set(appt.date.split('T')[0] || this.today);
    this.rescheduleSelectedSlot.set('');
    this.loadRescheduleSlots(appt.doctorId.toString(), appt.serviceId?.toString());
  }

  closeRescheduleModal() {
    this.rescheduleAppointmentId.set(null);
    this.rescheduleSlots.set([]);
    this.rescheduleSelectedSlot.set('');
  }

  onRescheduleDateChange(date: string) {
    this.rescheduleDate.set(date);
    const appt = this.appointmentsList().find((a) => a.id === this.rescheduleAppointmentId());
    if (appt) {
      this.loadRescheduleSlots(appt.doctorId.toString(), appt.serviceId?.toString());
    }
  }

  loadRescheduleSlots(doctorId: string, serviceId?: string) {
    this.loadingSlots.set(true);
    this.apiService.getDoctorSlots(doctorId, { date: this.rescheduleDate(), serviceId }).subscribe({
      next: (slots) => {
        this.rescheduleSlots.set(slots.filter((s) => s.isAvailable).map((s) => s.time));
        this.loadingSlots.set(false);
      },
      error: () => {
        this.rescheduleSlots.set([]);
        this.loadingSlots.set(false);
      },
    });
  }

  submitReschedule() {
    const id = this.rescheduleAppointmentId();
    if (!id || !this.rescheduleSelectedSlot() || this.rescheduling()) return;

    this.rescheduling.set(true);
    this.apiService
      .rescheduleAppointment(id, {
        date: this.rescheduleDate(),
        startTime: this.rescheduleSelectedSlot(),
      })
      .subscribe({
        next: () => {
          this.toastService.success(this.translateService.instant('calendar.action_success'));
          this.loadAppointments();
          this.closeRescheduleModal();
          this.rescheduling.set(false);
        },
        error: () => {
          this.toastService.error(this.translateService.instant('calendar.action_failed'));
          this.rescheduling.set(false);
        },
      });
  }

  statusClass(status: Appointment['status']): string {
    const map: Record<Appointment['status'], string> = {
      PendingPayment: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      Confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Arrived: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      NoShow: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
      Cancelled: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
    };
    return map[status] ?? 'bg-slate-100 text-slate-800';
  }

  paymentClass(paymentStatus?: string | null): string {
    if (paymentStatus === 'Paid') {
      return '!bg-emerald-100 !text-emerald-800 dark:!bg-emerald-900/30 dark:!text-emerald-400';
    }
    if (paymentStatus === 'Refunded') {
      return '!bg-slate-200 !text-slate-800 dark:!bg-slate-800 dark:!text-slate-400';
    }
    if (paymentStatus === 'Failed') {
      return '!bg-rose-100 !text-rose-800 dark:!bg-rose-900/30 dark:!text-rose-400';
    }
    return '!bg-orange-100 !text-orange-800 dark:!bg-orange-900/30 dark:!text-orange-400';
  }
}
