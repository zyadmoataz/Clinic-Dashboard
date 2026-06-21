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

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [DataTableComponent, FeedbackStatesComponent, ButtonComponent, LoadingComponent],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Services</h1>
        <app-button> + Add Service </app-button>
      </div>

      <p class="text-muted mb-5">Bookable services per doctor.</p>

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
          {{ errMsg() }}
        </div>
      }

      @if (!loadingStatus() && !errMsg() && servicesArr().length > 0) {
        <app-data-table [columns]="tableColumns" [data]="tableData()" />
      }
    </div>
  `,
})
export class ServicesComponent {
  apiService = inject(ApiService);

  servicesArr = signal<Service[]>([]);
  loadingStatus = signal(true);
  errMsg = signal<string | null>(null);

  tableColumns = ['Name', 'Doctor', 'Duration', 'Price'];

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
        this.errMsg.set('Failed to load services');
        this.loadingStatus.set(false);
      },
    });
  }
}
