// ==========================================
// OWNER: Zyad (Maintainer) & All Developers (Consumers)
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <select
        class="flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      >
        <option value="" disabled hidden>Select an option</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    </div>
  `,
})
export class SelectComponent {}
