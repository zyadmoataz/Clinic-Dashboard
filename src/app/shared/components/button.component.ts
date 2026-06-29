// ==========================================
// OWNER: Zyad (Maintainer) & All Developers (Consumers)
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [disabled]="disabled()"
      class="inline-flex cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 {{
        customClass()
      }}"
      (click)="onClick($event)"
      [type]="type()"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  disabled = input<boolean>(false);
  customClass = input<string>('bg-primary text-white hover:bg-primary-hover h-10 px-4 py-2');
  clicked = output<MouseEvent>();
  type = input<'button' | 'submit'>('button');

  onClick(event: MouseEvent) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}
