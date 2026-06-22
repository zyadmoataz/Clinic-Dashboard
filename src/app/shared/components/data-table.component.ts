// ==========================================
// OWNER: Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TableActionsComponent } from './table-actions.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TableActionsComponent],
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
          <!--  @for (row of data(); track $index) {-->
          @for (row of data(); track row.id) {
            <tr class="bg-surface hover:bg-surface-2 transition-colors">
              <!-- @for (cell of row; track $index) {-->
              @for (cell of row.cells; track $index) {
                <td class="px-6 py-4 text-center">
                  {{ cell }}
                </td>
              }

              <td class="px-6 py-4">
                <app-table-actions
                  [showView]="false"
                  [showEdit]="false"
                  (delete)="deleteClicked.emit(row.id)"
                />
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class DataTableComponent {
  columns = input.required<string[]>();
  data = input.required<
    {
      id: number;
      cells: (string | number)[];
    }[]
  >();

  deleteClicked = output<number>();
}
