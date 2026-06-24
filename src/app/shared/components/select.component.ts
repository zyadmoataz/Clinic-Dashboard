// ==========================================
// OWNER: Zyad (Maintainer) & All Developers (Consumers)
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <select
        class="text-text bg-surface focus:border-primary focus:ring-primary mb-5 flex h-10 w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
        [disabled]="disabled()"
        [value]="selectedValue()"
        (change)="onChange($event)"
      >
        <option value="" disabled selected>
          {{ placeholder() }}
        </option>

        @for (item of options(); track item[valueKey()]) {
          <option [value]="item[valueKey()]">
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
