import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { DashboardStats } from '../../../core/models';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private api = inject(ApiService);
  private translate = inject(TranslateService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal(false);

  today = signal(this.getFormattedDate(this.translate.currentLang() || 'en'));

  private getFormattedDate(lang: string): string {
    return new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  constructor() {
    this.translate.onLangChange.subscribe((event) => {
      this.today.set(this.getFormattedDate(event.lang));
    });
    this.api.getDashboardStats().subscribe({
      next: (dashboardStats) => {
        this.stats.set(dashboardStats);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
