// ==========================================
// OWNER: Zyad (Maintainer) & All Developers (Consumers)
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  template: `
    <div class="w-full">
      <select
        class="flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        [disabled]="disabled()"
        [value]="selectedValue()"
        (change)="onChange($event)"
      >
        <option value="" disabled>
          {{ placeholder() }}
        </option>

        @for (item of options(); track item[valueKey()]) {
          <option [value]="item[valueKey()]" [selected]="item[valueKey()] === selectedValue()">
            {{ item[labelKey()] }}
          </option>
        }
      </select>
    </div>
  `,
})
export class SelectComponent {
  options = input<any[]>([]);
  labelKey = input<string>('label');
  valueKey = input<string>('value');
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);

  valueChange = output<string>();
  selectedValue = input<string>('');

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(value);
  }
}
