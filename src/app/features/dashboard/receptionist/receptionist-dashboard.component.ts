import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Appointment, DashboardStats } from '../../../core/models';
import { ArabicDigitsPipe } from '../../../shared/pipes/arabic-digits.pipe';
import {
  getAppointmentStatusClass,
  getStatusAccentClass,
} from '../../../core/utils/status-style.util';
import { toLocalIsoDate } from '../../../core/utils/format.util';
import { SearchInputComponent } from '../../../shared/components/search-input.component';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
    TranslatePipe,
    ArabicDigitsPipe,
    SearchInputComponent,
  ],
  templateUrl: './receptionist-dashboard.component.html',
})
export class ReceptionistDashboardComponent {
  private api = inject(ApiService);
  private translate = inject(TranslateService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  stats = signal<DashboardStats | null>(null);
  upcomingAppointments = signal<Appointment[]>([]);
  ticketSearch = signal<string>('');
  queueFilter = signal<'all' | 'Confirmed' | 'Arrived'>('all');
  loading = signal(true);
  error = signal(false);

  today = signal(this.getFormattedDate('en'));
  todayIso = toLocalIsoDate();

  filteredQueue = computed(() => {
    const q = this.ticketSearch().trim().toLowerCase();
    const filter = this.queueFilter();
    return this.upcomingAppointments().filter((a) => {
      if (filter === 'Confirmed' && !['Confirmed', 'PendingPayment'].includes(a.status)) {
        return false;
      }
      if (filter === 'Arrived' && a.status !== 'Arrived') return false;
      if (!q) return true;
      return (
        (a.ticketCode || '').toLowerCase().includes(q) ||
        (a.queueToken || '').toLowerCase().includes(q) ||
        (a.patientName || '').toLowerCase().includes(q) ||
        (a.doctorName || '').toLowerCase().includes(q)
      );
    });
  });

  private getFormattedDate(lang: string): string {
    return new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  constructor() {
    const sub = this.translate.onLangChange.subscribe((event) => {
      this.today.set(this.getFormattedDate(event.lang));
    });
    this.refreshQueue();
    const timer = setInterval(() => this.refreshQueue(true), 8000);
    const storageSub = fromEvent<StorageEvent>(window, 'storage').subscribe((e) => {
      if (e.key === 'medora_staff_mock_db_v4') this.refreshQueue(true);
    });
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
      storageSub.unsubscribe();
      clearInterval(timer);
    });
  }

  refreshQueue(silent = false): void {
    if (!silent) this.loading.set(true);
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
            .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  checkIn(id: number): void {
    this.api.markArrived(id).subscribe({
      next: () => {
        this.toast.success('Patient checked in to waiting queue.');
        this.refreshQueue(true);
      },
      error: () => this.toast.error('Could not update check-in status.'),
    });
  }

  collectCash(id: number): void {
    this.api.markCashPaid(id).subscribe({
      next: () => {
        this.toast.success('Cash payment recorded.');
        this.refreshQueue(true);
      },
      error: () => this.toast.error('Could not record payment.'),
    });
  }

  statusClass = getAppointmentStatusClass;
  borderClass = getStatusAccentClass;
}
