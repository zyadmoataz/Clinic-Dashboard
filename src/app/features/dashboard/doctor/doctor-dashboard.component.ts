import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Appointment } from '../../../core/models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-dashboard.component.html',
})
export class DoctorDashboardComponent {
  private api = inject(ApiService);

  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  error = signal(false);

  todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  constructor() {
    this.api.getDoctorSchedule().subscribe({
      next: (appts) => {
        this.appointments.set(
          appts.sort((a, b) => (a.timeSlot || '').localeCompare(b.timeSlot || '')),
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  get patientCount(): number {
    return this.appointments().length;
  }

  statusLabel(status: Appointment['status']): string {
    const map: Record<string, string> = {
      Confirmed: 'Confirmed',
      PendingPayment: 'Pending payment',
      Arrived: 'Arrived',
      Completed: 'Completed',
      NoShow: 'No-show',
      Cancelled: 'Cancelled',
    };
    return map[status] ?? status;
  }

  statusClass(status: Appointment['status']): string {
    const map: Record<string, string> = {
      Confirmed: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
      PendingPayment: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
      Arrived: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
      Completed: 'bg-[var(--color-surface-2)] text-[var(--color-muted)]',
      NoShow: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
      Cancelled: 'bg-[var(--color-surface-2)] text-[var(--color-faint)]',
    };
    return map[status] ?? '';
  }

  canStartVisit(status: Appointment['status']): boolean {
    return status === 'Arrived';
  }
  canOpen(status: Appointment['status']): boolean {
    return status === 'Confirmed';
  }
  canViewNotes(status: Appointment['status']): boolean {
    return status === 'Completed';
  }

  startVisit(appt: Appointment): void {
    console.log('Start visit', appt.id);
  }
  openAppointment(appt: Appointment): void {
    console.log('Open appointment', appt.id);
  }
}
