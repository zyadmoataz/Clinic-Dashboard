// ==========================================
// OWNER: Othman
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-medium text-gray-500">Total Patients</p>
      <h3 class="mt-2 text-2xl font-bold text-gray-900">1,234</h3>
      <p class="mt-2 text-xs text-green-600">+12% from last month</p>
    </div>
  `,
})
export class StatCardComponent {}
