import {
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
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
          [type]="effectiveType()"
          [name]="name()"
          [placeholder]="placeholder() | translate"
          [min]="min() ?? null"
          [attr.aria-invalid]="!!error()"
          [value]="value"
          [disabled]="disabled"
          (input)="onInputChange($event)"
          (blur)="onTouched()"
          [ngClass]="{
            'pe-11': isPassword(),
            'cursor-not-allowed border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]':
              disabled,
            'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/15':
              !error() && !disabled,
            'border-[var(--color-danger)] bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20':
              error() && !disabled,
          }"
          class="flex h-11 w-full rounded-xl border px-4 py-2 text-sm shadow-xs transition-all duration-200 outline-none placeholder:text-[var(--color-faint)] focus:ring-4 focus:outline-none focus-visible:outline-none"
        />
        @if (isPassword()) {
          <button
            type="button"
            (click)="togglePassword()"
            [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
            class="text-faint hover:text-text hover:bg-surface-2 absolute end-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg transition-colors"
          >
            @if (showPassword()) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
                />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path
                  d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
                />
                <path d="m2 2 20 20" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          </button>
        }
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

  showPassword = signal(false);
  isPassword = computed(() => this.type() === 'password');
  effectiveType = computed(() => (this.isPassword() && this.showPassword() ? 'text' : this.type()));

  value = '';
  disabled = false;

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
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
