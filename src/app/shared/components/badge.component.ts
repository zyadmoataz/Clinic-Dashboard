import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  template: `
    <span
      class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 {{
        customClass()
      }}"
    >
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  customClass = input<string>('');
}
