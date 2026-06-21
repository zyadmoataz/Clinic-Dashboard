// ==========================================
// OWNER: Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: ` <div
    class="border-border bg-surface w-full overflow-hidden rounded-xl border shadow-sm"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="border-border bg-surface-2 border-b">
          <tr>
            @for (column of columns(); track column) {
              <th class="text-muted px-6 py-3 text-center font-medium">
                {{ column | translate }}
              </th>
            }
          </tr>
        </thead>
        <tbody class="divide-border divide-y">
          @for (row of data(); track $index) {
            <tr class="bg-surface hover:bg-surface-2 transition-colors">
              @for (cell of row; track $index) {
                <td class="px-6 py-4 text-center">
                  {{ cell }}
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class DataTableComponent {
  columns = input.required<string[]>();
  data = input.required<(string | number)[][]>();
}
