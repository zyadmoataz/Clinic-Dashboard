// ==========================================
// OWNER: Omar, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full max-w-md">
      <input
        type="text"
        class="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        placeholder="Search..."
      />
    </div>
  `,
})
export class SearchInputComponent {}
