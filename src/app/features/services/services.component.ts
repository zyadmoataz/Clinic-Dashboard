// ==========================================
// OWNER: Doaa
// ==========================================
import { Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Service } from '../../core/models';
import {
  ButtonComponent,
  DataTableComponent,
  FeedbackStatesComponent,
  ModalComponent,
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../core/services/toast.service';

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
  ],
  template: `
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">{{ 'header.services' | translate }}</h1>
      <app-button> + {{ 'services.add' | translate }} </app-button>
    </div>

    <p class="text-muted mb-5 text-xs md:text-sm">{{ 'services.subtitle' | translate }}</p>

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
      />
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
          <app-button (clicked)="closeDeleteModal()">
            {{ 'services.delete_modal.cancel' | translate }}
          </app-button>

          <app-button
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

  loadingStatus = signal<boolean>(true);
  errMsg = signal<string | null>(null);

  selectedService = signal<Service | null>(null);
  showDeleteModal = signal<boolean>(false);

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
  }

  loadServices() {
    this.loadingStatus.set(true);
    this.errMsg.set(null);

    this.apiService.getServices().subscribe({
      next: (data) => {
        this.servicesArr.set(data);
        this.loadingStatus.set(false);
      },
      error: () => {
        this.errMsg.set('services.load_failed');
        this.loadingStatus.set(false);
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
}
