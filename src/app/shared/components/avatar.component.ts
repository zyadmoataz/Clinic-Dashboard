// ==========================================
// OWNER: Zyad, Othman, Omar, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800"
      [ngClass]="{
        'h-8 w-8 text-xs': size() === 'sm',
        'h-10 w-10 text-sm': size() === 'md',
        'h-12 w-12 text-base': size() === 'lg',
      }"
    >
      {{ initials }}
    </div>
  `,
})
export class AvatarComponent {
  readonly name = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  get initials(): string {
    const name = this.name();
    if (!name) return 'AU';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return 'AU';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
