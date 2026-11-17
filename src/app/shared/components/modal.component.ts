import { Component, HostListener, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close modal backdrop"
        class="fixed inset-0 cursor-default bg-black/55 backdrop-blur-xs"
        (click)="closed.emit()"
      ></button>
      <div
        class="bg-surface border-border relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-6 shadow-xl"
      >
        @if (title()) {
          <div class="border-border mb-4 flex items-center justify-between border-b pb-3">
            <h2 class="text-text text-lg font-bold">{{ title() }}</h2>
            <button
              type="button"
              aria-label="Close modal"
              (click)="closed.emit()"
              class="text-muted hover:bg-surface-2 hover:text-text cursor-pointer rounded-full p-1.5"
            >
              <lucide-icon name="x" class="h-4 w-4"></lucide-icon>
            </button>
          </div>
        }
        <ng-content />
      </div>
    </div>
  `,
})
export class ModalComponent {
  title = input<string>('');
  closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closed.emit();
  }
}
