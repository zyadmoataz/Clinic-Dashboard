// ==========================================
// OWNER: Othman, Omar, Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">{{ title() }}</h1>
        <p class="text-muted mb-5 text-xs md:text-sm">{{ description() }}</p>
      </div>
      <div class="flex gap-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  title = input<string>('Page Title');
  description = input<string>('Page description goes here.');
}
