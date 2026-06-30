import {
  Component,
  input,
  output,
  forwardRef,
  signal,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
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
    <div class="relative w-full">
      <button
        type="button"
        (click)="toggleDropdown()"
        (blur)="onBlur()"
        [disabled]="disabled() || isDisabled"
        class="flex h-11 w-full items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span class="truncate" [class.text-slate-400]="!hasSelectedValue()">
          {{ getDisplayLabel() }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 text-slate-400 transition-transform duration-200"
          [class.rotate-180]="isOpen()"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      @if (isOpen()) {
        <div
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg focus:outline-none"
        >
          @for (item of options(); track item.value) {
            <div
              (click)="selectItem(item.value)"
              (keydown.enter)="selectItem(item.value)"
              (keydown.space)="selectItem(item.value)"
              tabindex="0"
              class="relative cursor-pointer py-2 pr-9 pl-4 text-sm transition-colors select-none hover:bg-[var(--color-surface-2)]"
              [class.bg-[var(--color-primary)]]="isItemSelected(item.value)"
              [class.text-white]="isItemSelected(item.value)"
              [class.text-[var(--color-text)]]="!isItemSelected(item.value)"
            >
              <span class="block truncate" [class.font-semibold]="isItemSelected(item.value)">
                {{ item.label }}
              </span>
              @if (isItemSelected(item.value)) {
                <span class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              }
            </div>
          } @empty {
            <div class="px-4 py-3 text-center text-sm text-slate-500">
              {{ emptyMessage() }}
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SelectComponent implements ControlValueAccessor {
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Select an option');
  emptyMessage = input<string>('No options available');
  disabled = input<boolean>(false);

  valueChange = output<string>();
  selectedValue = input<string>('');

  internalValue = '';
  isDisabled = false;
  isOpen = signal(false);

  private elementRef = inject(ElementRef);

  private onChangeFn: (value: string) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    if (!this.disabled() && !this.isDisabled) {
      this.isOpen.update((v) => !v);
    }
  }

  isItemSelected(value: string | number): boolean {
    return String(value) === String(this.internalValue || this.selectedValue());
  }

  selectItem(value: string | number) {
    this.internalValue = String(value);
    this.valueChange.emit(this.internalValue);
    this.onChangeFn(this.internalValue);
    this.isOpen.set(false);
  }

  hasSelectedValue(): boolean {
    return !!(this.internalValue || this.selectedValue());
  }

  getDisplayLabel(): string {
    const val = this.internalValue || this.selectedValue();
    if (!val) return this.placeholder();
    const opt = this.options().find((o) => o.value === val);
    return opt ? opt.label : this.placeholder();
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
