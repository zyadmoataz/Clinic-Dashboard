import { Component, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <button
      (click)="toggleLanguage()"
      class="flex h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none"
      aria-label="Toggle language"
    >
      <lucide-icon name="globe" class="h-5 w-5"></lucide-icon>
      <span>{{ currentLang === 'en' ? 'AR' : 'EN' }}</span>
    </button>
  `,
})
export class LanguageToggleComponent {
  currentLang = 'en';

  private translate = inject(TranslateService);

  constructor() {
    this.translate.use('en');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLang;
  }
}
