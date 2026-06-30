import { Component, input, forwardRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="mb-4 w-full">
      @if (label()) {
        <label
          [for]="inputId"
          class="mb-1.5 block text-sm font-semibold tracking-wide text-[var(--color-text)]"
          >{{ label() | translate }}</label
        >
      }
      <div class="relative">
        <input
          [id]="inputId"
          [type]="type()"
          [name]="name()"
          [placeholder]="placeholder() | translate"
          [min]="min() ?? null"
          [value]="value"
          [disabled]="disabled"
          (input)="onInputChange($event)"
          (blur)="onTouched()"
          [ngClass]="{
            'cursor-not-allowed border-slate-200 bg-slate-50 text-[var(--color-muted)] dark:border-slate-700 dark:bg-[var(--color-surface-2)]':
              disabled,
            'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-slate-400 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20':
              !error() && !disabled,
            'border-rose-300 bg-[var(--color-surface)] text-[var(--color-text)] focus:border-rose-500 focus:ring-rose-500/20':
              error() && !disabled,
          }"
          class="flex h-11 w-full rounded-xl border px-4 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:ring-4 focus:outline-none"
        />
      </div>
      @if (error()) {
        <p class="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-4 w-4"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
          {{ error() }}
        </p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('common.enter_text');
  name = input<string>('');
  min = input<string>();
  error = input<string | null | false>(null);

  value = '';
  disabled = false;
  onChange: (value: string) => void = () => {
    // no-op
  };
  onTouched: () => void = () => {
    // no-op
  };

  readonly inputId = 'input-' + Math.random().toString(36).substring(2, 9);

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

  private cdr = inject(ChangeDetectorRef);

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}
