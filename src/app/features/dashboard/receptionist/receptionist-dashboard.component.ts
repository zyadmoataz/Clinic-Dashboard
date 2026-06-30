import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Appointment, DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './receptionist-dashboard.component.html',
})
export class ReceptionistDashboardComponent {
  private api = inject(ApiService);

  stats = signal<DashboardStats | null>(null);
  upcomingAppointments = signal<Appointment[]>([]);
  loading = signal(true);
  error = signal(false);

  today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  todayIso = new Date().toISOString().split('T')[0];

  constructor() {
    this.api.getDashboardStats().subscribe({
      next: (dashboardStats) => {
        this.stats.set(dashboardStats);
        this.loadAppointments();
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  private loadAppointments(): void {
    this.api.getAppointments({ date: this.todayIso }).subscribe({
      next: (appts) => {
        this.upcomingAppointments.set(
          appts
            .filter((a) => ['Confirmed', 'PendingPayment', 'Arrived'].includes(a.status))
            .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
            .slice(0, 8),
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
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

  borderClass(status: Appointment['status']): string {
    const map: Record<string, string> = {
      Confirmed: 'bg-[var(--color-success)]',
      PendingPayment: 'bg-[var(--color-warning)]',
      Arrived: 'bg-[var(--color-primary)]',
    };
    return map[status] ?? 'bg-[var(--color-border-strong)]';
  }

  get awaitingPaymentCount(): number {
    return this.upcomingAppointments().filter((a) => a.status === 'PendingPayment').length;
  }
}
