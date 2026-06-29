// ==========================================
// OWNER: Othman, Omar, Doaa, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  template: `
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold sm:text-3xl">{{ title() }}</h1>
        <p class="text-muted mt-1 text-xs md:text-sm">{{ description() }}</p>
      </div>
      <div class="flex shrink-0 gap-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  title = input<string>('Page Title');
  description = input<string>('Page description goes here.');
}
