// ==========================================
// OWNER: Othman
// ==========================================
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ClinicReports } from '../../core/models';

export interface WeekBar {
  label: string;
  value: number;
  heightPct: number;
}

export interface ServiceBar {
  name: string;
  revenue: number;
  pct: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  private api = inject(ApiService);

  reports: ClinicReports | null = null;
  loading = true;
  error = false;

  weekBars: WeekBar[] = [];
  serviceBars: ServiceBar[] = [];

  statusMix = [
    { label: 'Confirmed', pct: 61, color: 'var(--color-success)' },
    { label: 'Completed', pct: 22, color: '#34d399' },
    { label: 'Awaiting payment', pct: 10, color: 'var(--color-warning)' },
    { label: 'No-show / cancelled', pct: 7, color: 'var(--color-danger)' },
  ];

  noShowThisMonth = 6.2;
  noShowLastMonth = 7.6;
  noShowTarget = 8;

  readonly RADIUS = 48;
  readonly CX = 60;
  readonly CY = 60;
  readonly CIRCUMFERENCE = 2 * Math.PI * 48;

  ngOnInit(): void {
    this.api.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.buildWeekBars(data);
        this.buildServiceBars(data);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private buildWeekBars(data: ClinicReports): void {
    const shares = [0.22, 0.27, 0.24, 0.27];
    const values = shares.map((s) => Math.round(data.totalRevenue * s));
    const max = Math.max(...values);
    this.weekBars = values.map((v, i) => ({
      label: `W${i + 1}`,
      value: v,
      heightPct: Math.round((v / max) * 100),
    }));
  }

  private buildServiceBars(data: ClinicReports): void {
    if (!data.revenueByService?.length) return;
    const max = Math.max(...data.revenueByService.map((s) => s.revenue));
    this.serviceBars = data.revenueByService.map((s) => ({
      name: s.serviceName,
      revenue: s.revenue,
      pct: Math.round((s.revenue / max) * 100),
    }));
  }

  donutSegments(): Array<{ color: string; dashArray: string; dashOffset: number }> {
    let offset = 0;
    return this.statusMix.map((item) => {
      const length = (item.pct / 100) * this.CIRCUMFERENCE;
      const segment = {
        color: item.color,
        dashArray: `${length} ${this.CIRCUMFERENCE - length}`,
        dashOffset: -offset,
      };
      offset += length;
      return segment;
    });
  }

  exportCsv(): void {
    if (!this.reports) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Revenue', this.reports.totalRevenue],
      ['Completed Visits', this.reports.completedVisitsCount],
      ['New Patients', this.reports.newPatientsCount],
      ...this.reports.revenueByService.map((s) => [s.serviceName, s.revenue]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clinic-reports.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
