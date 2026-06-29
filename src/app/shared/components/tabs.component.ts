// ==========================================
// OWNER: Othman, Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [],
  template: `
    <div class="flex w-fit gap-2 rounded-full bg-gray-100 p-1">
      <button
        class="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors"
      >
        Active Tab
      </button>
      <button
        class="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        Inactive Tab
      </button>
    </div>
  `,
})
export class TabsComponent {}
