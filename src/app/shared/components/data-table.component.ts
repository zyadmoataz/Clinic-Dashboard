// ==========================================
// OWNER: Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-border bg-surface w-full overflow-hidden rounded-xl border shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-border bg-surface-2 border-b">
            <tr>
              <th class="text-muted px-6 py-3 font-medium">ID</th>
              <th class="text-muted px-6 py-3 font-medium">Name</th>
              <th class="text-muted px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-border divide-y">
            <!-- Team: Duplicate this tr for each row of data! -->
            <tr class="bg-surface hover:bg-surface-2 transition-colors">
              <td class="px-6 py-4">1</td>
              <td class="px-6 py-4">Example Name</td>
              <td class="px-6 py-4">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class DataTableComponent {
  // Team: You can add simple inputs here, or just use *ngFor directly in the HTML above!
}
