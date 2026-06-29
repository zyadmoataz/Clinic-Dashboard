import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  template: `
    <div class="border-border bg-surface flex items-center justify-center rounded-xl border py-12">
      <div
        class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
      ></div>
    </div>
  `,
})
export class LoadingComponent {}
