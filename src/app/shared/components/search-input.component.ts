import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="relative w-full">
      <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4">
        <svg
          class="h-4 w-4 text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <input
        type="text"
        (input)="onSearch($event)"
        class="h-11 w-full rounded-xl border border-slate-200 bg-white ps-11 pe-4 text-sm text-[var(--color-text)] shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        [placeholder]="placeholder() | translate"
      />
    </div>
  `,
})
export class SearchInputComponent {
  placeholder = input<string>('patients.search_placeholder');
  searchChange = output<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
