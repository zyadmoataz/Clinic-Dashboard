import { Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Doctor, Service } from '../../core/models';
import {
  ButtonComponent,
  DataTableComponent,
  FeedbackStatesComponent,
  ModalComponent,
  PageHeaderComponent,
  InputComponent,
  SelectComponent,
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../core/services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    DataTableComponent,
    FeedbackStatesComponent,
    ButtonComponent,
    LoadingComponent,
    TranslatePipe,
    ModalComponent,
    ReactiveFormsModule,
    CommonModule,
    PageHeaderComponent,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  servicesList = signal<Service[]>([]);
  doctorsList = signal<Doctor[]>([]);

  loadingStatus = signal<boolean>(true);
  errMsg = signal<string | null>(null);

  createServiceLoading = signal<boolean>(false);

  selectedService = signal<Service | null>(null);
  showDeleteModal = signal<boolean>(false);
  showCreateModal = signal<boolean>(false);

  isEditMode = signal<boolean>(false);
  editingService = signal<Service | null>(null);

  fb = inject(FormBuilder);

  createServiceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    durationMinutes: [30, [Validators.required, Validators.min(30)]],
    price: [50, [Validators.required, Validators.min(50)]],
    doctorId: ['', Validators.required],
  });

  tableColumns = [
    'services.columns.name',
    'services.columns.doctor',
    'services.columns.duration',
    'services.columns.price',
  ];

  tableData = computed(() =>
    this.servicesList().map((ser) => ({
      id: ser.id,
      cells: [ser.name, ser.doctorName, `${ser.durationMinutes} min`, `${ser.price} EGP`],
    })),
  );

  constructor() {
    this.loadServices();
    this.loadDoctors();
  }

  loadServices() {
    this.loadingStatus.set(true);
    this.errMsg.set(null);

    this.apiService.getServices().subscribe({
      next: (servicesResponse) => {
        this.servicesList.set(servicesResponse);
        this.loadingStatus.set(false);
      },
      error: () => {
        this.errMsg.set('services.load_failed');
        this.loadingStatus.set(false);
      },
    });
  }

  loadDoctors() {
    this.apiService.getDoctors().subscribe({
      next: (doctorsResponse) => {
        this.doctorsList.set(doctorsResponse.items);
      },
    });
  }

  openDeleteModal(currentService: Service) {
    this.selectedService.set(currentService);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedService.set(null);
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  openEditModal(service: Service) {
    this.isEditMode.set(true);
    this.editingService.set(service);

    this.createServiceForm.patchValue({
      name: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      doctorId: service.doctorId,
    });

    this.showCreateModal.set(true);
    this.createServiceForm.controls.doctorId.disable();
  }

  confirmDelete() {
    const currentService = this.selectedService();

    if (!currentService) return;

    this.apiService.deleteService(currentService.id).subscribe({
      next: () => {
        this.servicesList.update((arr) => arr.filter((s) => s.id !== currentService.id));
        this.toastService.success(
          this.translateService.instant('services.delete_modal.delete_success'),
        );
        this.closeDeleteModal();
      },
      error: () => {
        this.toastService.error(
          this.translateService.instant('services.delete_modal.delete_failed'),
        );
      },
    });
  }

  onDeleteClicked(id: string | number) {
    const service = this.servicesList().find((s) => s.id === Number(id)) ?? null;
    if (!service) return;
    this.openDeleteModal(service);
  }

  onEditClicked(id: string | number) {
    const service = this.servicesList().find((s) => s.id === Number(id));
    if (!service) return;

    this.openEditModal(service);
  }

  submitService() {
    if (this.createServiceForm.invalid) {
      this.createServiceForm.markAllAsTouched();
      return;
    }

    const formValue = this.createServiceForm.getRawValue();

    this.createServiceLoading.set(true);

    const request = this.isEditMode()
      ? this.apiService.updateService(this.editingService()!.id, {
          name: formValue.name!,
          durationMinutes: formValue.durationMinutes!,
          price: formValue.price!,
        })
      : this.apiService.createService({
          name: formValue.name!,
          durationMinutes: formValue.durationMinutes!,
          price: formValue.price!,
          doctorId: formValue.doctorId!,
        });

    request.subscribe({
      next: (serviceResponse) => {
        if (this.isEditMode()) {
          this.servicesList.update((arr) =>
            arr.map((s) => (s.id === serviceResponse.id ? serviceResponse : s)),
          );
          this.toastService.success(this.translateService.instant('services.update_success'));
        } else {
          this.servicesList.update((arr) => [...arr, serviceResponse]);
          this.toastService.success(this.translateService.instant('services.create_success'));
        }

        this.closeCreateModal();
        this.resetForm();

        this.createServiceLoading.set(false);
      },

      error: () => {
        this.toastService.error(this.translateService.instant('services.save_failed'));
        this.createServiceLoading.set(false);
      },
    });
  }

  resetForm() {
    this.createServiceForm.reset({
      name: '',
      durationMinutes: 30,
      price: 50,
      doctorId: '',
    });

    this.isEditMode.set(false);
    this.editingService.set(null);
    this.createServiceForm.controls.doctorId.enable();
  }
}
