// ==========================================
// OWNER: Doaa
// ==========================================
import { Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Doctor, Service } from '../../core/models';
import {
  ButtonComponent,
  DataTableComponent,
  FeedbackStatesComponent,
  ModalComponent,
  PageHeaderComponent,
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
  ],
  template: `
    <app-page-header
      [title]="'header.services' | translate"
      [description]="'services.subtitle' | translate"
    >
      <app-button type="button" (clicked)="openCreateModal()">
        + {{ 'services.add' | translate }}
      </app-button>
    </app-page-header>

    @if (loadingStatus()) {
      <app-loading />
    }

    @if (!loadingStatus() && servicesArr().length === 0) {
      <app-feedback-states />
    }

    @if (errMsg()) {
      <div
        class="border-danger bg-danger-soft text-danger rounded-xl border p-4 text-center font-medium"
      >
        {{ errMsg() | translate }}
      </div>
    }

    @if (!loadingStatus() && !errMsg() && servicesArr().length > 0) {
      <app-data-table
        [columns]="tableColumns"
        [data]="tableData()"
        (deleteClicked)="onDeleteClicked($event)"
        (editClicked)="onEditClicked($event)"
      />
    }

    @if (showCreateModal()) {
      <app-modal>
        <h2 class="text-text mb-4 text-xl font-bold">
          {{
            isEditMode()
              ? ('services.edit_modal.title' | translate)
              : ('services.create_modal.title' | translate)
          }}
        </h2>

        <form [formGroup]="createServiceForm" (ngSubmit)="submitService()" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium">
              {{ 'services.create_modal.name' | translate }}
            </label>

            <input type="text" formControlName="name" class="w-full rounded-lg border p-2" />

            @if (
              createServiceForm.controls.name.touched &&
              createServiceForm.controls.name.hasError('required')
            ) {
              <p class="text-danger mt-1 text-sm">
                {{ 'services.create_modal.name_required' | translate }}
              </p>
            }

            @if (
              createServiceForm.controls.name.touched &&
              createServiceForm.controls.name.hasError('minlength')
            ) {
              <p class="text-danger mt-1 text-sm">
                {{ 'services.create_modal.name_min' | translate }}
              </p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">
              {{ 'services.create_modal.duration' | translate }}
            </label>

            <input
              type="number"
              formControlName="durationMinutes"
              class="w-full rounded-lg border p-2"
            />

            @if (
              createServiceForm.controls.durationMinutes.touched &&
              createServiceForm.controls.durationMinutes.hasError('required')
            ) {
              <p class="text-danger mt-1 text-sm">
                {{ 'services.create_modal.duration_required' | translate }}
              </p>
            }

            @if (
              createServiceForm.controls.durationMinutes.touched &&
              createServiceForm.controls.durationMinutes.hasError('min')
            ) {
              <p class="text-danger mt-1 text-sm">
                {{ 'services.create_modal.duration_min' | translate }}
              </p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">
              {{ 'services.create_modal.price' | translate }}
            </label>

            <input type="number" formControlName="price" class="w-full rounded-lg border p-2" />

            @if (
              createServiceForm.controls.price.touched &&
              createServiceForm.controls.price.hasError('required')
            ) {
              <p class="text-danger mt-1 text-sm">
                {{ 'services.create_modal.price_required' | translate }}
              </p>
            }

            @if (
              createServiceForm.controls.price.touched &&
              createServiceForm.controls.price.hasError('min')
            ) {
              <p class="text-danger mt-1 text-sm">
                {{ 'services.create_modal.price_min' | translate }}
              </p>
            }
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">
              {{ 'services.create_modal.doctor' | translate }}
            </label>

            <select
              formControlName="doctorId"
              class="bg-surface text-text w-full rounded-lg border p-2"
              [ngClass]="{
                'cursor-not-allowed opacity-70': isEditMode(),
              }"
            >
              <option value="" disabled selected>
                {{ 'services.create_modal.select_doctor' | translate }}
              </option>

              @for (doctor of doctorsArr(); track doctor.id) {
                <option [value]="doctor.id">
                  {{ doctor.displayName }}
                </option>
              }
            </select>

            @if (
              createServiceForm.controls.doctorId.touched &&
              createServiceForm.controls.doctorId.hasError('required')
            ) {
              <p class="text-danger mt-1 text-sm">
                {{ 'services.create_modal.doctor_required' | translate }}
              </p>
            }
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <app-button
              type="button"
              (clicked)="closeCreateModal()"
              customClass="bg-slate-500 hover:bg-slate-400"
            >
              {{ 'services.create_modal.cancel' | translate }}
            </app-button>

            <app-button type="submit" [disabled]="createServiceLoading()">
              {{
                createServiceLoading()
                  ? ('services.load' | translate)
                  : isEditMode()
                    ? ('services.edit_modal.edit' | translate)
                    : ('services.create_modal.create' | translate)
              }}
            </app-button>
          </div>
        </form>
      </app-modal>
    }

    @if (showDeleteModal()) {
      <app-modal>
        <h2 class="text-text mb-4 text-xl font-bold">
          {{ 'services.delete_modal.title' | translate }}
          <strong>"{{ selectedService()?.name }}"</strong>
        </h2>

        <p class="text-muted mb-6">
          {{ 'services.delete_modal.message' | translate }}
        </p>

        <div class="flex justify-end gap-2">
          <app-button
            type="button"
            (clicked)="closeDeleteModal()"
            customClass="bg-surface-2 text-text border border-border hover:bg-slate-200"
          >
            {{ 'services.delete_modal.cancel' | translate }}
          </app-button>

          <app-button
            type="button"
            customClass="bg-red-600 hover:bg-red-700 text-white"
            (clicked)="confirmDelete()"
          >
            {{ 'services.delete_modal.delete' | translate }}
          </app-button>
        </div>
      </app-modal>
    }
  `,
})
export class ServicesComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  servicesArr = signal<Service[]>([]);
  doctorsArr = signal<Doctor[]>([]);

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
    'services.columns.actions',
  ];

  tableData = computed(() =>
    this.servicesArr().map((ser) => ({
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
      next: (resp) => {
        this.servicesArr.set(resp);
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
      next: (resp) => {
        this.doctorsArr.set(resp.items);
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
        this.servicesArr.update((servArr) => servArr.filter((s) => s.id !== currentService.id));
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

  onDeleteClicked(id: number) {
    const service = this.servicesArr().find((s) => s.id === id) ?? null;
    if (!service) return;
    this.openDeleteModal(service);
  }

  onEditClicked(id: number) {
    const service = this.servicesArr().find((s) => s.id === id);
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
      next: (resp) => {
        if (this.isEditMode()) {
          this.servicesArr.update((arr) => arr.map((s) => (s.id === resp.id ? resp : s)));
          this.toastService.success('Service updated successfully');
        } else {
          this.servicesArr.update((arr) => [...arr, resp]);
          this.toastService.success('Service created successfully');
        }

        this.closeCreateModal();
        this.resetForm();

        this.createServiceLoading.set(false);
      },

      error: () => {
        this.toastService.error('Add/Edit Service failed');
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
