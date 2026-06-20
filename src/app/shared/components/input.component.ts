// ==========================================
// OWNER: Zyad (Maintainer) & All Developers (Consumers)
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <label class="mb-1 block text-sm font-medium text-gray-700">Label</label>
      <input
        type="text"
        class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        placeholder="Enter text..."
      />
    </div>
  `,
})
export class InputComponent {}
