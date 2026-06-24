// ==========================================
// OWNER: Doaa
// ==========================================
import { Component, inject, signal } from '@angular/core';
import {
  FeedbackStatesComponent,
  PageHeaderComponent,
  SelectComponent,
} from '../../shared/components';
import { TranslatePipe } from '@ngx-translate/core';
import { Doctor, DoctorAvailability } from '../../core/models';
import { ApiService } from '../../core/services/api.service';
import { LoadingComponent } from '../../shared/components/loading.component';
@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TranslatePipe,
    LoadingComponent,
    SelectComponent,
    FeedbackStatesComponent,
  ],
  template: `
    <app-page-header
      [title]="'header.availability' | translate"
      [description]="'availability.subtitle' | translate"
    ></app-page-header>

    <app-select
      [options]="doctorsArr()"
      labelKey="displayName"
      valueKey="id"
      [placeholder]="'availability.select_doctor' | translate"
      (valueChange)="onDoctorSelect($event)"
    ></app-select>

    @if (!selectedDoctor() || doctorsArr().length === 0) {
      <app-feedback-states />
    }

    @if (selectedDoctor()) {
      <div class="mt-6 space-y-8">
        <section>
          <h2 class="text-lg font-semibold">Working Hours</h2>

          @if (loadingAvailStatus()) {
            <app-loading />
          }

          @for (item of availabilityArr(); track item.id) {
            <div class="flex gap-2">
              <span>{{ item.dayOfWeek }}</span>
              <span>{{ item.startTime }} - {{ item.endTime }}</span>
            </div>
          }
        </section>
      </div>
    }
  `,
})
export class AvailabilityComponent {
  apiService = inject(ApiService);

  doctorsArr = signal<Doctor[]>([]);
  availabilityArr = signal<DoctorAvailability[]>([]);

  selectedDoctor = signal<Doctor | null>(null);
  loadingAvailStatus = signal<boolean>(false);

  constructor() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.apiService.getDoctors().subscribe({
      next: (resp) => {
        this.doctorsArr.set(resp.items);
      },
    });
  }

  onDoctorSelect(id: string) {
    const doctor = this.doctorsArr().find((d) => d.id === id) ?? null;

    this.selectedDoctor.set(doctor);

    if (doctor) {
      this.loadAvailability(doctor.id);
    } else {
      this.availabilityArr.set([]);
    }
  }

  loadAvailability(doctorId: string) {
    this.loadingAvailStatus.set(true);

    this.apiService.getDoctorAvailability(doctorId).subscribe({
      next: (resp) => {
        this.availabilityArr.set(resp);
        this.loadingAvailStatus.set(false);
      },
      error: () => {
        this.availabilityArr.set([]);
        this.loadingAvailStatus.set(false);
      },
    });
  }
}
