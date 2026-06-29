// ==========================================
// OWNER: Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-sm">
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
      }

      @if (!isLoading()) {
        <div class="overflow-x-auto">
          <table class="w-full text-start">
            <thead>
              <tr
                class="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/40"
              >
                @for (col of columns(); track col) {
                  <th
                    class="px-6 py-4 text-start text-sm font-semibold whitespace-nowrap text-[var(--color-text)]"
                  >
                    {{ getLabel($any(col)) | translate }}
                  </th>
                }
                @if (hasActions()) {
                  <th
                    class="px-5 py-3.5 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                  >
                    {{ 'common.actions' | translate }}
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of data(); track row; let idx = $index; let last = $last) {
                <tr
                  class="group transition-colors duration-150 hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                  [class.border-b]="!last"
                  [class.border-slate-100]="!last"
                  [class.dark:border-slate-700/50]="!last"
                >
                  @for (cell of row.cells; track cell) {
                    <td class="px-5 py-4 text-sm text-[var(--color-text)]">
                      @if (isBoolean(cell)) {
                        <span
                          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          [ngClass]="
                            cell
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          "
                        >
                          <span
                            class="h-1.5 w-1.5 rounded-full"
                            [ngClass]="cell ? 'bg-emerald-500' : 'bg-rose-500'"
                          ></span>
                          {{
                            cell ? ('common.active' | translate) : ('common.inactive' | translate)
                          }}
                        </span>
                      }
                      @if (!isBoolean(cell)) {
                        {{
                          cell !== null && cell !== undefined ? cell.toString() : ('--' | translate)
                        }}
                      }
                    </td>
                  }
                  @if (hasActions()) {
                    <td class="px-5 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        @if (showEdit()) {
                          <button
                            (click)="editClicked.emit(row.id)"
                            class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10"
                          >
                            {{ 'common.edit' | translate }}
                          </button>
                        }
                        @if (showDelete()) {
                          <button
                            (click)="deleteClicked.emit(row.id)"
                            class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                          >
                            {{ 'common.delete' | translate }}
                          </button>
                        }
                        @if (showActivate()) {
                          <button
                            (click)="activateClicked.emit(row.id)"
                            class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
      }
    </div>
  `,
})
export class DataTableComponent {
  readonly data = input<
    {
      id: string | number;
      cells: (string | number | boolean | null | undefined)[];
    }[]
  >([]);
  readonly columns = input<{ label: string; [key: string]: unknown }[] | string[]>([]);
  readonly isLoading = input(false);

  deleteClicked = output<string | number>();
  editClicked = output<string | number>();
  activateClicked = output<string | number>();

  readonly showEdit = input(false);
  readonly showDelete = input(false);
  readonly showActivate = input(false);

  isBoolean(val: unknown): boolean {
    return typeof val === 'boolean';
  }

  isString(val: unknown): val is string {
    return typeof val === 'string';
  }

  getLabel(col: string | { label: string; [key: string]: unknown }): string {
    return typeof col === 'string' ? col : col.label;
  }

  hasActions(): boolean {
    return this.showEdit() || this.showDelete() || this.showActivate();
  }
}
