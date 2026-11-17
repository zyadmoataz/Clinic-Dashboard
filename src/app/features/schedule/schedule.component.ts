import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { Appointment } from '../../core/models';
import { VisitConsultationModalComponent } from './visit-consultation-modal.component';
import { getAppointmentStatusClass } from '../../core/utils/status-style.util';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslatePipe, VisitConsultationModalComponent],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  private api = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  appointments = signal<Appointment[]>([]);
  filter = signal<'active' | 'completed' | 'all'>('active');
  loading = signal(true);
  activeConsultation = signal<Appointment | null>(null);

  filteredAppointments = computed(() => {
    const mode = this.filter();
    return this.appointments()
      .filter((a) => {
        if (mode === 'active') return ['Confirmed', 'Arrived', 'PendingPayment'].includes(a.status);
        if (mode === 'completed') return a.status === 'Completed';
        return true;
      })
      .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  });

  constructor() {
    this.loadSchedule();
    const timer = setInterval(() => this.loadSchedule(true), 8000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  loadSchedule(silent = false) {
    if (!silent) this.loading.set(true);
    this.api.getDoctorSchedule().subscribe({
      next: (list) => {
        this.appointments.set(list ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusClass = getAppointmentStatusClass;
}
