import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import { Appointment } from '../../../core/models';
import { ArabicDigitsPipe } from '../../../shared/pipes/arabic-digits.pipe';
import { VisitConsultationModalComponent } from '../../schedule/visit-consultation-modal.component';
import { getAppointmentStatusClass } from '../../../core/utils/status-style.util';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ArabicDigitsPipe, VisitConsultationModalComponent],
  templateUrl: './doctor-dashboard.component.html',
})
export class DoctorDashboardComponent {
  private api = inject(ApiService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  appointments = signal<Appointment[]>([]);
  activeConsultation = signal<Appointment | null>(null);
  loading = signal(true);
  error = signal(false);

  todayLabel = signal(this.getFormattedDate('en'));

  private getFormattedDate(lang: string): string {
    return new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  constructor() {
    const sub = this.translate.onLangChange.subscribe((event) => {
      this.todayLabel.set(this.getFormattedDate(event.lang));
    });
    this.loadSchedule();
    const timer = setInterval(() => this.loadSchedule(true), 8000);
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
      clearInterval(timer);
    });
  }

  loadSchedule(silent = false): void {
    if (!silent) this.loading.set(true);
    this.api.getDoctorSchedule().subscribe({
      next: (appts) => {
        this.appointments.set(
          [...appts].sort((a, b) =>
            `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
          ),
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

  statusClass = getAppointmentStatusClass;

  startVisit(appt: Appointment): void {
    this.activeConsultation.set(appt);
  }

  openAppointment(appt: Appointment): void {
    this.activeConsultation.set(appt);
  }
}
