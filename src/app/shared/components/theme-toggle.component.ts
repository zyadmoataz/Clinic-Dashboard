// ==========================================
// OWNER: Zyad (Shared Components)
// PURPOSE: Global Theme toggle switch (Dark / Light)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="border-border bg-surface text-text hover:border-primary hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
      [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      [title]="isDark ? 'Light Mode' : 'Dark Mode'"
    >
      <lucide-icon [name]="isDark ? 'moon' : 'sun'" class="h-4 w-4"></lucide-icon>
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
