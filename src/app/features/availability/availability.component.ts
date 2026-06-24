// ==========================================
// OWNER: Doaa
// ==========================================
import { Component, inject, signal } from '@angular/core';
import {
  ButtonComponent,
  FeedbackStatesComponent,
  ModalComponent,
  PageHeaderComponent,
  SelectComponent,
} from '../../shared/components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BlockedDate, Doctor, DoctorAvailability } from '../../core/models';
import { ApiService } from '../../core/services/api.service';
import { LoadingComponent } from '../../shared/components/loading.component';
import { ToastService } from '../../core/services/toast.service';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TranslatePipe,
    LoadingComponent,
    SelectComponent,
    FeedbackStatesComponent,
    ButtonComponent,
    ModalComponent,
    LucideAngularModule,
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

    @if ((!selectedDoctor() || doctorsArr().length === 0) && !loadingAvailStatus()) {
      <app-feedback-states />
    }

    @if (selectedDoctor()) {
      <div class="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <section class="bg-surface flex-1 rounded-xl p-4">
          <h2 class="mb-3 text-lg font-semibold">{{ 'availability.working_hours' | translate }}</h2>

          @if (loadingAvailStatus()) {
            <app-loading />
          } @else {
            @if (availabilityArr().length === 0) {
              <app-feedback-states
                [showIcon]="false"
                titleKey=""
                descriptionKey="availability.no_working_hours"
              />
            }

            @for (item of availabilityArr(); track item.id) {
              <div class="flex gap-2">
                <span>{{ item.dayOfWeek }}</span>
                <span>{{ item.startTime }} - {{ item.endTime }}</span>
              </div>
            }
          }
        </section>

        <section class="bg-surface flex-1 rounded-xl p-4">
          <h2 class="mb-3 text-lg font-semibold">{{ 'availability.blocked_days' | translate }}</h2>

          @if (loadingBlockedStatus()) {
            <app-loading />
          } @else {
            @if (blockedDatesArr().length === 0) {
              <app-feedback-states
                [showIcon]="false"
                titleKey=""
                descriptionKey="availability.no_blocked_days"
              />
            }

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              @for (item of blockedDatesArr(); track item.id) {
                <div
                  class="border-border bg-surface relative flex flex-col items-center rounded-xl border p-4"
                >
                  <app-button
                    type="button"
                    customClass="rounded transition-all text-danger hover:bg-danger-soft hover:text-danger absolute top-3 inset-e-3 p-1"
                    (clicked)="openDeleteModal(item)"
                  >
                    <lucide-icon name="trash" class="h-4 w-4"></lucide-icon>
                  </app-button>

                  <div class="bg-primary-soft text-primary mb-3 rounded-full p-3">
                    <lucide-icon name="calendar" class="h-6 w-6"></lucide-icon>
                  </div>

                  <span class="text-text text-sm font-medium">
                    {{ item.date }}
                  </span>
                </div>
              }
            </div>
          }
        </section>
      </div>
    }
    @if (showDeleteModal()) {
      <app-modal>
        <h2 class="text-text mb-4 text-xl font-bold">
          {{ 'availability.delete_modal.title' | translate }}
        </h2>

        <p class="text-muted mb-6">
          {{ 'availability.delete_modal.message' | translate }}
        </p>

        <div class="flex justify-end gap-2">
          <app-button
            type="button"
            (clicked)="closeDeleteModal()"
            customClass="bg-secondary hover:bg-secondary-hover text-white h-10 px-4 py-2"
          >
            {{ 'availability.delete_modal.cancel' | translate }}
          </app-button>

          <app-button
            type="button"
            customClass="bg-danger hover:bg-danger-hover text-white h-10 px-4 py-2"
            (clicked)="confirmDeleteBlockedDate()"
          >
            {{ 'availability.delete_modal.delete' | translate }}
          </app-button>
        </div>
      </app-modal>
    }
  `,
})
export class AvailabilityComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  doctorsArr = signal<Doctor[]>([]);
  availabilityArr = signal<DoctorAvailability[]>([]);
  blockedDatesArr = signal<BlockedDate[]>([]);

  selectedDoctor = signal<Doctor | null>(null);
  selectedBlockedDate = signal<BlockedDate | null>(null);

  loadingAvailStatus = signal<boolean>(false);
  loadingBlockedStatus = signal<boolean>(false);

  showDeleteModal = signal<boolean>(false);

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
      this.loadBlockedDates(doctor.id);
    } else {
      this.availabilityArr.set([]);
      this.blockedDatesArr.set([]);
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

  loadBlockedDates(doctorId: string) {
    this.loadingBlockedStatus.set(true);

    this.apiService.getDoctorBlockedDates(doctorId).subscribe({
      next: (resp) => {
        this.blockedDatesArr.set(resp);
        this.loadingBlockedStatus.set(false);
      },
      error: () => {
        this.blockedDatesArr.set([]);
        this.loadingBlockedStatus.set(false);
      },
    });
  }

  openDeleteModal(blockedDate: BlockedDate) {
    this.selectedBlockedDate.set(blockedDate);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedBlockedDate.set(null);
  }

  confirmDeleteBlockedDate() {
    const blockedDate = this.selectedBlockedDate();
    const doctor = this.selectedDoctor();

    if (!blockedDate || !doctor) return;

    this.apiService.deleteDoctorBlockedDate(doctor.id, blockedDate.date).subscribe({
      next: () => {
        this.blockedDatesArr.update((arr) => arr.filter((item) => item.id !== blockedDate.id));

        this.toastService.success(
          this.translateService.instant('availability.delete_modal.delete_success'),
        );

        this.closeDeleteModal();
      },
      error: () => {
        this.toastService.error(
          this.translateService.instant('availability.delete_modal.delete_failed'),
        );
      },
    });
  }
}
