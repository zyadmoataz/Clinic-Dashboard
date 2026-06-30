import { Component, OnInit } from '@angular/core';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none"
      [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      [title]="isDark ? 'Light Mode' : 'Dark Mode'"
    >
      <lucide-icon [name]="isDark ? 'moon' : 'sun'" class="h-5 w-5"></lucide-icon>
    </button>
  `,
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;
  private readonly THEME_KEY = 'clarity-theme';

  ngOnInit() {
    // Sync with HTML class and localstorage
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    this.isDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.updateThemeClass();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem(this.THEME_KEY, this.isDark ? 'dark' : 'light');
    this.updateThemeClass();
  }

  private updateThemeClass() {
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
