import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Appointment, DashboardStats } from '../../../core/models';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ArabicDigitsPipe } from '../../../shared/pipes/arabic-digits.pipe';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, ArabicDigitsPipe],
  templateUrl: './receptionist-dashboard.component.html',
})
export class ReceptionistDashboardComponent {
  private api = inject(ApiService);
  private translate = inject(TranslateService);

  stats = signal<DashboardStats | null>(null);
  upcomingAppointments = signal<Appointment[]>([]);
  loading = signal(true);
  error = signal(false);

  today = signal(this.getFormattedDate(this.translate.currentLang() || 'en'));
  todayIso = new Date().toISOString().split('T')[0];

  private getFormattedDate(lang: string): string {
    return new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  constructor() {
    this.translate.onLangChange.subscribe((event) => {
      this.today.set(this.getFormattedDate(event.lang));
    });
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
