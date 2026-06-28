// ==========================================
// OWNER: Zyad (Maintainer) & All Developers (Consumers)
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="mb-3 w-full">
      @if (label()) {
        <label class="mb-1 block text-sm font-medium text-gray-700">{{ label() }}</label>
      }
      <input
        [type]="type()"
        [name]="name()"
        [placeholder]="placeholder()"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        class="focus:border-primary focus:ring-primary flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
      />
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('Enter text...');
  type = input<string>('text');
  name = input<string>('');

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  writeValue(value: string | null | undefined): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
