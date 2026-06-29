import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  stats: DashboardStats | null = null;
  loading = true;
  error = false;

  today = this.getFormattedDate(this.translate.currentLang() || 'en');

  private getFormattedDate(lang: string): string {
    return new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event) => {
      this.today = this.getFormattedDate(event.lang);
      this.cdr.detectChanges();
    });
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
