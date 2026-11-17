import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <label
      class="group flex w-full cursor-text items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 shadow-xs transition-all duration-200 focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/15 hover:border-[var(--color-border-strong)]"
      [ngClass]="compact() ? 'h-9 text-xs' : 'h-11 text-sm'"
    >
      <svg
        class="h-4 w-4 shrink-0 text-[var(--color-faint)] transition-colors group-focus-within:text-[var(--color-primary)]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="search"
        [value]="value()"
        (input)="onSearch($event)"
        [attr.aria-label]="placeholder() | translate"
        [placeholder]="placeholder() | translate"
        class="w-full min-w-0 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-faint)] focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      @if (value()) {
        <button
          type="button"
          aria-label="Clear search"
          (click)="clear()"
          class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--color-faint)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
            />
          </svg>
        </button>
      }
    </label>
  `,
})
export class SearchInputComponent {
  placeholder = input<string>('patients.search_placeholder');
  value = input<string>('');
  compact = input<boolean>(false);
  searchChange = output<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  clear(): void {
    this.searchChange.emit('');
  }
}
