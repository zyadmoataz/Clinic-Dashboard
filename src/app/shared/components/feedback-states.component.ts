// ==========================================
// OWNER: Omar, Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-states',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-12 text-center"
    >
      <div class="mb-4 rounded-full bg-blue-100 p-4">
        <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900">No Data</h3>
      <p class="mt-1 max-w-sm text-sm text-gray-500">There is nothing to display here yet.</p>
    </div>
  `,
})
export class FeedbackStatesComponent {}
