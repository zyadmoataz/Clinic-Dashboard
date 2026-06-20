// ==========================================
// OWNER: Othman
// PURPOSE: A section wrapper card with heading
// ==========================================
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card border-border bg-surface mb-6 rounded-xl border p-6 shadow-sm">
      <div class="border-border mb-4 flex items-center justify-between border-b pb-2">
        <div>
          <h3 class="text-text text-base font-bold">{{ sectionTitle() }}</h3>
          @if (sectionSubtitle()) {
            <p class="text-muted mt-0.5 text-xs">{{ sectionSubtitle() }}</p>
          }
        </div>
        <ng-content select="[actions]"></ng-content>
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class DashboardSectionComponent {
  sectionTitle = input<string>('');
  sectionSubtitle = input<string | undefined>(undefined);
}
