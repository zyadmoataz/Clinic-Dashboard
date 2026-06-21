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
} from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    DataTableComponent,
    FeedbackStatesComponent,
    ButtonComponent,
    LoadingComponent,
    TranslatePipe,
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
      <app-data-table [columns]="tableColumns" [data]="tableData()" />
    }
  `,
})
export class ServicesComponent {
  apiService = inject(ApiService);

  servicesArr = signal<Service[]>([]);
  loadingStatus = signal(true);
  errMsg = signal<string | null>(null);

  tableColumns = [
    'services.columns.name',
    'services.columns.doctor',
    'services.columns.duration',
    'services.columns.price',
  ];

  tableData = computed(() =>
    this.servicesArr().map((ser) => [
      ser.name,
      ser.doctorName,
      `${ser.durationMinutes} min`,
      `${ser.price} EGP`,
    ]),
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
}
