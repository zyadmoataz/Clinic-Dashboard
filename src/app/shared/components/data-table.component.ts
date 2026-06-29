// ==========================================
// OWNER: Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TableActionsComponent } from './table-actions.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
      <div *ngIf="isLoading" class="flex items-center justify-center py-16">
        <div class="text-lg text-gray-500">Loading...</div>
      </div>

      <table *ngIf="!isLoading" class="min-w-full">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th
              class="px-8 py-5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Name
            </th>

            <th
              class="px-6 py-5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Role
            </th>

            <th
              class="px-6 py-5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Specialty
            </th>

            <th
              class="px-6 py-5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Status
            </th>

            <th class="px-6 py-5"></th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr *ngFor="let staff of data" class="transition hover:bg-gray-50">
            <td class="px-8 py-5">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700"
                >
                  {{ staff.name?.charAt(0) }}
                </div>

                <div>
                  <p class="font-semibold text-gray-900">
                    {{ staff.name }}
                  </p>

                  <p class="text-sm text-gray-500">
                    {{ staff.email }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-6 py-5">
              <span class="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {{ staff.role }}
              </span>
            </td>

            <td class="px-6 py-5 text-gray-700">
              {{ staff.specialty || '—' }}
            </td>

            <td class="px-6 py-5">
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                [ngClass]="
                  staff.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                "
              >
                {{ staff.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>

            <td class="px-6 py-5 text-right">
              <button
                class="rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                {{ staff.isActive ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
})
export class DataTableComponent {
  @Input() data: any[] = [];

  @Input() columns: any[] = [];

  @Input() isLoading = false;
}
