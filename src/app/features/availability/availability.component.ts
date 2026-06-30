import { Component, computed, inject, signal } from '@angular/core';
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
import { ArabicDigitsPipe } from '../../shared/pipes/arabic-digits.pipe';
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
    ArabicDigitsPipe,
  ],
  templateUrl: './availability.component.html',
})
export class AvailabilityComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  doctorsList = signal<Doctor[]>([]);
  availabilities = signal<DoctorAvailability[]>([]);
  blockedDates = signal<BlockedDate[]>([]);
  editableAvailabilities = signal<DoctorAvailability[]>([]);
  newBlockedDate = signal<string>('');

  selectedDoctor = signal<Doctor | null>(null);
  selectedBlockedDate = signal<BlockedDate | null>(null);

  doctorsSelectOptions = computed(() =>
    this.doctorsList().map((d) => ({ value: d.id, label: d.displayName })),
  );

  loadingAvailStatus = signal<boolean>(false);
  loadingBlockedStatus = signal<boolean>(false);

  showDeleteModal = signal<boolean>(false);

  constructor() {
    this.loadDoctors();
  }

  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  dayOptions = computed(() => {
    this.translateService.currentLang(); // Trigger reactivity via translation signal
    return this.daysOfWeek.map((day) => ({
      label: this.translateService.instant(`days.${day.toLowerCase()}`),
      value: day,
    }));
  });

  loadDoctors() {
    this.apiService.getDoctors().subscribe({
      next: (doctorsResponse) => {
        this.doctorsList.set(doctorsResponse.items);
      },
    });
  }

  onDoctorSelect(id: string) {
    const doctor = this.doctorsList().find((d) => d.id === id) ?? null;

    this.selectedDoctor.set(doctor);

    if (doctor) {
      this.loadAvailability(doctor.id);
      this.loadBlockedDates(doctor.id);
    } else {
      this.availabilities.set([]);
      this.blockedDates.set([]);
    }
  }

  loadAvailability(doctorId: string) {
    this.loadingAvailStatus.set(true);

    this.apiService.getDoctorAvailability(doctorId).subscribe({
      next: (availabilitiesResponse) => {
        this.availabilities.set(availabilitiesResponse);
        this.loadingAvailStatus.set(false);
        this.editableAvailabilities.set([...availabilitiesResponse]);
      },
      error: () => {
        this.availabilities.set([]);
        this.loadingAvailStatus.set(false);
      },
    });
  }

  loadBlockedDates(doctorId: string) {
    this.loadingBlockedStatus.set(true);

    this.apiService.getDoctorBlockedDates(doctorId).subscribe({
      next: (blockedDatesResponse) => {
        this.blockedDates.set(blockedDatesResponse);
        this.loadingBlockedStatus.set(false);
      },
      error: () => {
        this.blockedDates.set([]);
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
        this.blockedDates.update((arr) => arr.filter((item) => item.id !== blockedDate.id));

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

  createBlockedDate() {
    const doctor = this.selectedDoctor();
    const date = this.newBlockedDate();

    if (!doctor || !date) return;

    this.apiService.createDoctorBlockedDate(doctor.id, { date }).subscribe({
      next: (newBlockedDateResponse) => {
        this.blockedDates.update((arr) => [...arr, newBlockedDateResponse]);

        this.newBlockedDate.set('');

        this.toastService.success(
          this.translateService.instant('availability.create_blocked_date_success'),
        );
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastService.error(
            this.translateService.instant('availability.date_already_blocked'),
          );
          return;
        }

        this.toastService.error(
          this.translateService.instant('availability.create_blocked_date_failed'),
        );
      },
    });
  }

  updateDay(index: number, day: string) {
    this.editableAvailabilities.update((arr) => {
      arr[index].dayOfWeek = day;
      return [...arr];
    });
  }

  updateStartTime(index: number, time: string) {
    this.editableAvailabilities.update((arr) => {
      arr[index].startTime = time;
      return [...arr];
    });
  }

  updateEndTime(index: number, time: string) {
    this.editableAvailabilities.update((arr) => {
      arr[index].endTime = time;
      return [...arr];
    });
  }

  removeAvailability(index: number) {
    this.editableAvailabilities.update((arr) => arr.filter((_, i) => i !== index));
  }

  addAvailabilityRow() {
    this.editableAvailabilities.update((arr) => [
      ...arr,
      {
        id: 0,
        dayOfWeek: 'Sunday',
        startTime: '09:00',
        endTime: '17:00',
      },
    ]);
  }

  saveAvailability() {
    const doctor = this.selectedDoctor();

    if (!doctor) return;

    const payload = this.editableAvailabilities().map((item) => ({
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
    }));

    this.apiService.setDoctorAvailability(doctor.id, payload).subscribe({
      next: () => {
        this.toastService.success(
          this.translateService.instant('availability.availability_updated'),
        );
        this.loadAvailability(doctor.id);
      },
      error: () => {
        this.toastService.error(
          this.translateService.instant('availability.availability_update_failed'),
        );
      },
    });
  }
}
