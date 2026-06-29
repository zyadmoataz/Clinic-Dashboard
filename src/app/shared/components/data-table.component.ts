// ==========================================
// OWNER: Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TableActionsComponent } from './table-actions.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div
      class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md"
    >
      <div *ngIf="isLoading" class="flex items-center justify-center py-16">
        <div class="text-lg text-[var(--color-muted)]">Loading...</div>
      </div>

      <table *ngIf="!isLoading" class="min-w-full">
        <thead class="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <tr>
            <th
              *ngFor="let col of columns"
              class="px-6 py-5 text-left text-xs font-semibold tracking-wider text-[var(--color-muted)] uppercase"
            >
              {{ col.label ? col.label : (col | translate) }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-[var(--color-border-subtle)]">
          <tr *ngFor="let row of data" class="transition hover:bg-[var(--color-surface-hover)]">
            <td
              *ngFor="let cell of row.cells"
              class="px-6 py-5 text-sm font-medium text-[var(--color-text)]"
            >
              <!-- If cell is a boolean (like isActive), render badge -->
              <span
                *ngIf="isBoolean(cell)"
                class="rounded-full px-3 py-1 text-xs font-semibold"
                [ngClass]="
                  cell
                    ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                    : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                "
              >
                {{ cell ? 'Active' : 'Inactive' }}
              </span>
              <!-- Normal text -->
              <span *ngIf="!isBoolean(cell)">{{ cell || '—' }}</span>
            </td>
            <!-- Actions (assuming the last column is actions) -->
            <td class="px-6 py-5 text-right" *ngIf="hasActions()">
              <div class="flex items-center justify-end gap-3">
                <button
                  *ngIf="editClicked.observed"
                  (click)="editClicked.emit(row.id)"
                  class="rounded-lg border border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]"
                >
                  Edit
                </button>
                <button
                  *ngIf="deleteClicked.observed"
                  (click)="deleteClicked.emit(row.id)"
                  class="rounded-lg bg-[var(--color-danger-soft)] px-3 py-1.5 text-sm font-medium text-[var(--color-danger)] transition hover:bg-red-100"
                >
                  Delete
                </button>
                <button
                  *ngIf="activateClicked.observed"
                  (click)="activateClicked.emit(row.id)"
                  class="rounded-lg border border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]"
                >
                  Toggle
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class DataTableComponent {
  @Input() data: { id: any; cells: any[] }[] = [];
  @Input() columns: any[] = [];
  @Input() isLoading = false;

  @Output() deleteClicked = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<number>();
  @Output() activateClicked = new EventEmitter<number>();

  isBoolean(val: any): boolean {
    return typeof val === 'boolean';
  }

  hasActions(): boolean {
    return (
      this.editClicked.observed || this.deleteClicked.observed || this.activateClicked.observed
    );
  }
}
