// ==========================================
// OWNER: Doaa, Helda
// PURPOSE: Centralized table actions row
// ==========================================
import { Component, input, output } from '@angular/core';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-table-actions',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="flex items-center justify-center gap-2">
      @if (showView()) {
        <button
          (click)="view.emit()"
          class="text-muted hover:bg-surface-2 hover:text-text rounded p-1 transition-colors"
          title="View"
        >
          <lucide-icon name="eye" class="h-4 w-4"></lucide-icon>
        </button>
      }
      @if (showEdit()) {
        <button
          (click)="edit.emit()"
          class="text-warning hover:bg-warning-soft rounded p-1 transition-colors"
          title="Edit"
        >
          <lucide-icon name="edit" class="h-4 w-4"></lucide-icon>
        </button>
      }
      @if (showDelete()) {
        <button
          (click)="delete.emit()"
          class="text-danger hover:bg-danger-soft rounded p-1 transition-colors"
          title="Delete"
        >
          <lucide-icon name="trash" class="h-4 w-4"></lucide-icon>
        </button>
      }
    </div>
  `,
})
export class TableActionsComponent {
  showView = input<boolean>(true);
  showEdit = input<boolean>(true);
  showDelete = input<boolean>(true);

  view = output<void>();
  edit = output<void>();
  delete = output<void>();
}
