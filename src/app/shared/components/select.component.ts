// ==========================================
// OWNER: Zyad (Maintainer) & All Developers (Consumers)
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input, output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SelectOption } from '../../core/models';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      <select
        class="flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        [disabled]="disabled() || isDisabled"
        [value]="internalValue || selectedValue()"
        (change)="onChange($event)"
        (blur)="onBlur()"
      >
        <option value="" disabled>
          {{ placeholder() }}
        </option>

        @for (item of options(); track item.value) {
          <option
            [value]="item.value"
            [selected]="item.value === (internalValue || selectedValue())"
          >
            {{ item.label }}
          </option>
        }
      </select>
    </div>
  `,
})
export class SelectComponent implements ControlValueAccessor {
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);

  valueChange = output<string>();
  selectedValue = input<string>('');

  internalValue = '';
  isDisabled = false;

  private onChangeFn: (value: string) => void = () => {
    /* default noop */
  };
  private onTouchedFn: () => void = () => {
    /* default noop */
  };

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.internalValue = value;
    this.valueChange.emit(value);
    this.onChangeFn(value);
  }

  onBlur() {
    this.onTouchedFn();
  }

  writeValue(val: string): void {
    this.internalValue = val || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
