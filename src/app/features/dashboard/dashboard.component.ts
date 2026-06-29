// ==========================================
// OWNER: Othman
// ==========================================
import { Component, OnInit, inject, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Appointment, DashboardStats } from '../../core/models';

// ─── Admin sub-view ───────────────────────────────────────────────────────────

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin/admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  stats: DashboardStats | null = null;
  loading = true;
  error = false;

  today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}

// ─── Receptionist sub-view ────────────────────────────────────────────────────

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './receptionist/receptionist-dashboard.component.html',
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

// ─── Doctor sub-view ──────────────────────────────────────────────────────────

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor/doctor-dashboard.component.html',
})
export class DoctorDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  appointments: Appointment[] = [];
  loading = true;
  error = false;

  todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  ngOnInit(): void {
    this.api.getDoctorSchedule().subscribe({
      next: (appts) => {
        this.appointments = appts.sort((a, b) =>
          (a.timeSlot || '').localeCompare(b.timeSlot || ''),
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get patientCount(): number {
    return this.appointments.length;
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

// ─── Shell ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminDashboardComponent,
    ReceptionistDashboardComponent,
    DoctorDashboardComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private auth = inject(AuthService);
  role = computed(() => this.auth.currentUser()?.role?.toLowerCase() ?? '');
}
