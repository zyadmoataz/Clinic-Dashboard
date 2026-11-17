import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [disabled]="disabled()"
      class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 {{
        resolvedClass()
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
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  customClass = input<string>('');
  clicked = output<MouseEvent>();
  type = input<'button' | 'submit'>('button');

  resolvedClass = computed(() => {
    const custom = this.customClass().trim();
    const map: Record<string, string> = {
      primary:
        'h-10 bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm hover:bg-[var(--color-primary-hover)]',
      secondary:
        'h-10 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
      danger:
        'h-10 bg-[var(--color-danger)] text-white shadow-sm hover:bg-[var(--color-danger-hover)]',
      ghost: 'h-10 text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
    };
    const base = map[this.variant()] ?? map['primary'];
    return custom ? `${base} ${custom}` : base;
  });

  onClick(event: MouseEvent) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}
