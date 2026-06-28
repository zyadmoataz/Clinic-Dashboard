// ==========================================
// OWNER: Othman
// ==========================================
import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Appointment } from '../../core/models';

// Real shape returned by GET /api/dashboard/stats
interface DashboardStats {
  todaysAppointments: number;
  confirmed: number;
  arrived: number;
  completed: number;
  noShow: number;
  todaysRevenue: number;
}

// ─── Admin sub-view ───────────────────────────────────────────────────────────

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin/admin-dashboard.component.html',
  styleUrl: './admin/admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);

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
    // TODO: remove mock when backend fixes /api/dashboard/stats
    this.stats = {
      todaysAppointments: 24,
      confirmed: 18,
      arrived: 9,
      completed: 5,
      noShow: 1,
      todaysRevenue: 4250,
    };
    this.loading = false;

    // this.api.getDashboardStats().subscribe({
    //   next: (data: any) => { this.stats = data; this.loading = false; },
    //   error: () => { this.error = true; this.loading = false; },
    // });
  }
}

// ─── Receptionist sub-view ────────────────────────────────────────────────────

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './receptionist/receptionist-dashboard.component.html',
  styleUrl: './receptionist/receptionist-dashboard.component.scss',
})
export class ReceptionistDashboardComponent implements OnInit {
  private api = inject(ApiService);

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
    // TODO: remove mock when backend fixes /api/dashboard/stats
    this.stats = {
      todaysAppointments: 24,
      confirmed: 18,
      arrived: 9,
      completed: 5,
      noShow: 1,
      todaysRevenue: 4250,
    };
    this.loadAppointments();

    // this.api.getDashboardStats().subscribe({
    //   next: (data: any) => { this.stats = data; this.loadAppointments(); },
    //   error: () => { this.error = true; this.loading = false; },
    // });
  }

  private loadAppointments(): void {
    // TODO: remove mock when backend fixes /api/appointments
    this.upcomingAppointments = [
      {
        id: 1,
        doctorId: 1,
        patientId: 1,
        serviceId: 1,
        patientName: 'Sara Al-Amri',
        doctorName: 'Dr. Hassan',
        serviceName: 'Dermatology · Room 4',
        date: this.todayIso,
        timeSlot: '09:30',
        status: 'Confirmed' as Appointment['status'],
      },
      {
        id: 2,
        doctorId: 2,
        patientId: 2,
        serviceId: 2,
        patientName: 'Khalid Yusuf',
        doctorName: 'Dr. Nasser',
        serviceName: 'Cardiology · Room 2',
        date: this.todayIso,
        timeSlot: '10:30',
        status: 'PendingPayment' as Appointment['status'],
      },
      {
        id: 3,
        doctorId: 1,
        patientId: 3,
        serviceId: 1,
        patientName: 'Mona Adel',
        doctorName: 'Dr. Hassan',
        serviceName: 'Dermatology · Room 4',
        date: this.todayIso,
        timeSlot: '11:00',
        status: 'Arrived' as Appointment['status'],
      },
      {
        id: 4,
        doctorId: 3,
        patientId: 4,
        serviceId: 3,
        patientName: 'Omar Farouk',
        doctorName: 'Dr. Kamal',
        serviceName: 'Orthopedics · Room 1',
        date: this.todayIso,
        timeSlot: '11:30',
        status: 'Confirmed' as Appointment['status'],
      },
    ];
    this.loading = false;

    // this.api.getAppointments({ date: this.todayIso }).subscribe({
    //   next: (appts) => {
    //     this.upcomingAppointments = appts
    //       .filter((a) => ['Confirmed', 'PendingPayment', 'Arrived'].includes(a.status))
    //       .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
    //       .slice(0, 8);
    //     this.loading = false;
    //   },
    //   error: () => { this.loading = false; },
    // });
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
      Confirmed: 'badge-confirmed',
      PendingPayment: 'badge-pending',
      Arrived: 'badge-arrived',
      Completed: 'badge-completed',
      NoShow: 'badge-noshow',
      Cancelled: 'badge-cancelled',
    };
    return map[status] ?? '';
  }

  borderClass(status: Appointment['status']): string {
    const map: Record<string, string> = {
      Confirmed: 'border-confirmed',
      PendingPayment: 'border-pending',
      Arrived: 'border-arrived',
    };
    return map[status] ?? 'border-default';
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
  styleUrl: './doctor/doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent implements OnInit {
  private api = inject(ApiService);

  appointments: Appointment[] = [];
  loading = true;
  error = false;

  todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  ngOnInit(): void {
    // TODO: remove mock when backend fixes /api/doctor/schedule
    this.appointments = [
      {
        id: 1,
        doctorId: 1,
        patientId: 1,
        serviceId: 1,
        patientName: 'Sara Al-Amri',
        doctorName: 'Dr. Hassan',
        serviceName: 'Consultation · 30 min',
        date: this.todayLabel,
        timeSlot: '09:30',
        status: 'Arrived' as Appointment['status'],
      },
      {
        id: 2,
        doctorId: 1,
        patientId: 2,
        serviceId: 2,
        patientName: 'Mona Adel',
        doctorName: 'Dr. Hassan',
        serviceName: 'Follow-up · 15 min',
        date: this.todayLabel,
        timeSlot: '11:00',
        status: 'Confirmed' as Appointment['status'],
      },
      {
        id: 3,
        doctorId: 1,
        patientId: 3,
        serviceId: 1,
        patientName: 'Hana Saeed',
        doctorName: 'Dr. Hassan',
        serviceName: 'Consultation · 30 min',
        date: this.todayLabel,
        timeSlot: '08:30',
        status: 'Completed' as Appointment['status'],
      },
    ].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    this.loading = false;

    // this.api.getDoctorSchedule().subscribe({
    //   next: (appts) => {
    //     this.appointments = appts.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    //     this.loading = false;
    //   },
    //   error: () => { this.error = true; this.loading = false; },
    // });
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
      Confirmed: 'badge-confirmed',
      PendingPayment: 'badge-pending',
      Arrived: 'badge-arrived',
      Completed: 'badge-completed',
      NoShow: 'badge-noshow',
      Cancelled: 'badge-cancelled',
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

// ─── Shell — routes by role ───────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminDashboardComponent,
    ReceptionistDashboardComponent,
    DoctorDashboardComponent,
  ],
  template: `
    <ng-container [ngSwitch]="role()">
      <app-admin-dashboard *ngSwitchCase="'admin'" />
      <app-receptionist-dashboard *ngSwitchCase="'receptionist'" />
      <app-doctor-dashboard *ngSwitchCase="'doctor'" />
      <div class="no-role" *ngSwitchDefault>No dashboard available for your role.</div>
    </ng-container>
  `,
  styles: [
    `
      .no-role {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 3rem;
        color: var(--color-muted);
        font-size: 0.9rem;
      }
    `,
  ],
})
export class DashboardComponent {
  private auth = inject(AuthService);
  role = computed(() => this.auth.currentUser()?.role?.toLowerCase() ?? '');
}
