// ==========================================
// OWNER: Zyad, Othman, Omar, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <app-button variant="ghost" (clicked)="toggleLanguage()" aria-label="Toggle language">
      <lucide-icon name="globe" class="mr-1 h-5 w-5"></lucide-icon>
      <span class="text-xs font-bold">{{ currentLang === 'en' ? 'AR' : 'EN' }}</span>
    </app-button>
  `,
})
export class LanguageToggleComponent {
  currentLang = 'en';

  constructor(private translate: TranslateService) {
    this.translate.use('en');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLang;
  }
}
