// ==========================================
// OWNER: Othman, Omar, Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Page Title</h1>
        <p class="mt-1 text-sm text-gray-500">Page description goes here.</p>
      </div>
      <div class="flex gap-2">
        <!-- Actions go here -->
      </div>
    </div>
  `,
})
export class PageHeaderComponent {}
