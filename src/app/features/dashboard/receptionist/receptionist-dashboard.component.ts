import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
export class ReceptionistDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  stats: DashboardStats | null = null;
  upcomingAppointments: Appointment[] = [];
  loading = true;
  error = false;

  today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  todayIso = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadAppointments();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadAppointments(): void {
    this.api.getAppointments({ date: this.todayIso }).subscribe({
      next: (appts) => {
        this.upcomingAppointments = appts
          .filter((a) => ['Confirmed', 'PendingPayment', 'Arrived'].includes(a.status))
          .sort((a, b) => (a.timeSlot || '').localeCompare(b.timeSlot || ''))
          .slice(0, 8);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
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
    return this.upcomingAppointments.filter((a) => a.status === 'PendingPayment').length;
  }
}
