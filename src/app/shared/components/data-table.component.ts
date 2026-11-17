import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

export type DataTableCellType = 'text' | 'avatar' | 'price' | 'duration' | 'role' | 'boolean';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LucideAngularModule],
  template: `
    <div
      class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
    >
      @if (isLoading()) {
        <div class="flex items-center justify-center py-20">
          <div class="flex flex-col items-center gap-3 text-[var(--color-muted)]">
            <svg
              class="h-8 w-8 animate-spin text-[var(--color-primary)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-sm font-medium">{{ 'common.loading' | translate }}</span>
          </div>
        </div>
      } @else if (data().length === 0) {
        <div class="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <lucide-icon name="inbox" class="h-8 w-8 text-[var(--color-faint)]"></lucide-icon>
          <p class="text-sm font-semibold text-[var(--color-muted)]">{{ emptyLabel() }}</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-start">
            <thead>
              <tr class="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                @for (col of columns(); track col) {
                  <th
                    class="px-5 py-3.5 text-start text-xs font-bold tracking-wider whitespace-nowrap text-[var(--color-muted)] uppercase"
                  >
                    {{ getLabel($any(col)) | translate }}
                  </th>
                }
                @if (hasActions()) {
                  <th
                    class="px-5 py-3.5 text-end text-xs font-bold tracking-wider whitespace-nowrap text-[var(--color-muted)] uppercase"
                  >
                    {{ 'common.actions' | translate }}
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of data(); track row.id; let last = $last) {
                <tr
                  class="group transition-colors duration-150 hover:bg-[var(--color-primary-soft)]/35"
                  [class.border-b]="!last"
                  [class.border-[var(--color-border)]]="!last"
                >
                  @for (cell of row.cells; track $index; let cIdx = $index) {
                    <td class="px-5 py-3.5 text-sm whitespace-nowrap text-[var(--color-text)]">
                      @if (isBoolean(cell)) {
                        <span
                          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                          [ngClass]="
                            cell
                              ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                              : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                          "
                        >
                          <span
                            class="h-1.5 w-1.5 rounded-full"
                            [ngClass]="
                              cell ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'
                            "
                          ></span>
                          {{
                            cell ? ('common.active' | translate) : ('common.inactive' | translate)
                          }}
                        </span>
                      } @else if (cellType(cIdx) === 'avatar') {
                        <div class="flex items-center gap-3">
                          <span
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-xs font-extrabold text-[var(--color-primary)]"
                          >
                            {{ getInitials(cell) }}
                          </span>
                          <span class="font-semibold text-[var(--color-text)]">{{
                            formatCell(cell)
                          }}</span>
                        </div>
                      } @else if (cellType(cIdx) === 'price') {
                        <span
                          class="inline-flex items-center rounded-lg bg-[var(--color-success-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--color-success)] tabular-nums"
                        >
                          {{ formatCell(cell) }}
                        </span>
                      } @else if (cellType(cIdx) === 'duration') {
                        <span
                          class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)] tabular-nums"
                        >
                          <lucide-icon name="clock" class="h-3.5 w-3.5"></lucide-icon>
                          {{ formatCell(cell) }}
                        </span>
                      } @else if (cellType(cIdx) === 'role') {
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize"
                          [ngClass]="roleClass(cell)"
                        >
                          {{ formatCell(cell) }}
                        </span>
                      } @else {
                        <span class="text-[var(--color-text)]">{{ formatCell(cell) }}</span>
                      }
                    </td>
                  }
                  @if (hasActions()) {
                    <td class="px-5 py-3.5 text-end">
                      <div class="flex items-center justify-end gap-2">
                        @if (showEdit()) {
                          <button
                            type="button"
                            [attr.aria-label]="('common.edit' | translate) + ' ' + row.id"
                            (click)="editClicked.emit(row.id)"
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
                          >
                            <lucide-icon name="edit" class="h-3.5 w-3.5"></lucide-icon>
                            {{ 'common.edit' | translate }}
                          </button>
                        }
                        @if (showDelete()) {
                          <button
                            type="button"
                            [attr.aria-label]="('common.delete' | translate) + ' ' + row.id"
                            (click)="deleteClicked.emit(row.id)"
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-danger)] transition-colors hover:border-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]"
                          >
                            <lucide-icon name="trash" class="h-3.5 w-3.5"></lucide-icon>
                            {{ 'common.delete' | translate }}
                          </button>
                        }
                        @if (showActivate()) {
                          <button
                            type="button"
                            (click)="activateClicked.emit(row.id)"
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
                          >
                            {{ 'common.toggle' | translate }}
                          </button>
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div
          class="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/60 px-5 py-2.5 text-xs font-medium text-[var(--color-muted)]"
        >
          <span
            >Total records:
            <strong class="text-[var(--color-text)] tabular-nums">{{ data().length }}</strong></span
          >
          <span>Live Clinic Directory</span>
        </div>
      }
    </div>
  `,
})
export class DataTableComponent {
  readonly data = input<
    { id: string | number; cells: (string | number | boolean | null | undefined)[] }[]
  >([]);
  readonly columns = input<{ label: string; [key: string]: unknown }[] | string[]>([]);
  readonly columnTypes = input<DataTableCellType[]>([]);
  readonly isLoading = input(false);
  readonly emptyLabel = input('No records found.');

  deleteClicked = output<string | number>();
  editClicked = output<string | number>();
  activateClicked = output<string | number>();

  readonly showEdit = input(false);
  readonly showDelete = input(false);
  readonly showActivate = input(false);

  isBoolean(val: unknown): boolean {
    return typeof val === 'boolean';
  }

  cellType(idx: number): DataTableCellType {
    return this.columnTypes()[idx] ?? 'text';
  }

  formatCell(val: unknown): string {
    return val !== null && val !== undefined && String(val).trim() !== '' ? String(val) : '--';
  }

  getInitials(val: unknown): string {
    const clean = String(val || 'C')
      .replace(/^Dr\.\s*/i, '')
      .trim();
    const parts = clean.split(/\s+/).filter((w) => /[a-zA-Z0-9\u0600-\u06FF]/.test(w));
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return clean.slice(0, 2).toUpperCase();
  }

  roleClass(val: unknown): string {
    const s = String(val || '').toLowerCase();
    if (s.includes('admin')) return 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]';
    if (s.includes('doctor')) return 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]';
    if (s.includes('registered') || s.includes('receptionist'))
      return 'bg-[var(--color-success-soft)] text-[var(--color-success)]';
    return 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]';
  }

  getLabel(col: string | { label: string; [key: string]: unknown }): string {
    return typeof col === 'string' ? col : col.label;
  }

  hasActions(): boolean {
    return this.showEdit() || this.showDelete() || this.showActivate();
  }
}
