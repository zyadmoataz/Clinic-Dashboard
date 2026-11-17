import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

let nextLogoId = 0;

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center gap-3">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        [class]="size() === 'sm' ? 'h-8 w-8' : 'h-10 w-10'"
        class="shrink-0 drop-shadow-xs"
      >
        <defs>
          <linearGradient
            [attr.id]="gradId"
            x1="6"
            y1="4"
            x2="58"
            y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#1d4ed8" />
            <stop offset="55%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#0f766e" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="16" [attr.fill]="'url(#' + gradId + ')'" />
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="15"
          fill="none"
          stroke="#ffffff"
          stroke-opacity="0.24"
          stroke-width="1.5"
        />
        <rect x="25.5" y="13" width="13" height="38" rx="4.5" fill="#ffffff" />
        <rect x="13" y="25.5" width="38" height="13" rx="4.5" fill="#ffffff" />
        <path
          d="M17.5 32 H25 L28.5 23.5 L33.5 40.5 L37.5 28 L40 32 H46.5"
          fill="none"
          stroke="#0f766e"
          stroke-width="2.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span
        [class]="
          inverted()
            ? 'text-2xl leading-tight font-extrabold tracking-tight text-white'
            : 'text-text text-xl leading-tight font-extrabold tracking-tight'
        "
      >
        Medora
        <span [class]="inverted() ? 'font-semibold text-white/85' : 'text-primary font-semibold'">
          Clinics
        </span>
      </span>
    </span>
  `,
})
export class BrandLogoComponent {
  size = input<'sm' | 'md'>('md');
  inverted = input<boolean>(false);
  readonly gradId = `medora-staff-grad-${++nextLogoId}`;
}
