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
      class="border-border bg-surface flex flex-col items-center justify-center rounded-xl border p-12 text-center"
    >
      <div class="bg-primary-soft text-primary mb-4 rounded-full p-4">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-text text-lg font-bold">No Data</h3>
      <p class="text-muted mt-1 max-w-sm text-sm">There is nothing to display here yet.</p>
    </div>
  `,
})
export class FeedbackStatesComponent {}
