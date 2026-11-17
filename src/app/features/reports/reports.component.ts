import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Chart } from 'chart.js';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { ClinicReports } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  private api = inject(ApiService);
  private translate = inject(TranslateService);

  readonly doughnutCanvas = viewChild<ElementRef<HTMLCanvasElement>>('doughnutCanvas');
  readonly barCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barCanvas');

  private doughnutChart?: Chart;
  private barChart?: Chart;

  reports = signal<ClinicReports | null>(null);
  loading = signal(true);
  error = signal(false);

  noShowThisMonth = 0;
  noShowLastMonth = 7.6;
  noShowTarget = 8;

  statusMix = signal<{ key: string; pct: number; dot: string }[]>([]);
  serviceBars = signal<{ name: string; revenue: number; pct: number }[]>([]);
  weekValues = signal<number[]>([]);

  constructor() {
    this.api.getReports().subscribe({
      next: (clinicReports) => {
        this.reports.set(clinicReports);
        if (clinicReports) {
          this.weekValues.set(
            [0.22, 0.27, 0.24, 0.27].map((s) => Math.round(clinicReports.totalRevenue * s)),
          );
          this.buildStatusMix(clinicReports);
          this.buildServiceBars(clinicReports);
        }
        this.loading.set(false);
        setTimeout(() => this.initCharts(), 0);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  private buildStatusMix(data: ClinicReports): void {
    const b = data.statusBreakdown ?? {
      confirmed: 50,
      completed: 35,
      awaitingPayment: 10,
      noShowOrCancelled: 5,
    };
    this.noShowThisMonth = b.noShowOrCancelled;
    this.statusMix.set([
      { key: 'confirmed', pct: b.confirmed, dot: 'bg-[var(--color-primary)]' },
      { key: 'completed', pct: b.completed, dot: 'bg-[var(--color-success)]' },
      { key: 'awaiting_payment', pct: b.awaitingPayment, dot: 'bg-[var(--color-warning)]' },
      { key: 'no_show', pct: b.noShowOrCancelled, dot: 'bg-[var(--color-danger)]' },
    ]);
  }

  private tokenColor(name: string, fallback: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  private async initCharts(): Promise<void> {
    const {
      Chart,
      ArcElement,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
      DoughnutController,
      BarController,
    } = await import('chart.js');
    Chart.register(
      ArcElement,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
      DoughnutController,
      BarController,
    );

    const colors = [
      this.tokenColor('--color-primary', '#3b82f6'),
      this.tokenColor('--color-success', '#10b981'),
      this.tokenColor('--color-warning', '#f59e0b'),
      this.tokenColor('--color-danger', '#ef4444'),
    ];

    if (this.doughnutCanvas()?.nativeElement) {
      this.doughnutChart?.destroy();
      this.doughnutChart = new Chart(this.doughnutCanvas()!.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.statusMix().map((m) => this.translate.instant(`reports.status.${m.key}`)),
          datasets: [
            { data: this.statusMix().map((m) => m.pct), backgroundColor: colors, borderWidth: 0 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '72%',
          plugins: { legend: { display: false } },
        },
      });
    }

    if (this.barCanvas()?.nativeElement) {
      this.barChart?.destroy();
      this.barChart = new Chart(this.barCanvas()!.nativeElement, {
        type: 'bar',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4'],
          datasets: [{ data: this.weekValues(), backgroundColor: colors[1], borderRadius: 6 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { grid: { display: false } }, y: { min: 0 } },
        },
      });
    }
  }

  private buildServiceBars(data: ClinicReports): void {
    if (!data.revenueByService?.length) return;
    const max = Math.max(...data.revenueByService.map((s) => s.revenue)) || 1;
    this.serviceBars.set(
      data.revenueByService.map((s) => ({
        name: s.serviceName,
        revenue: s.revenue,
        pct: Math.round((s.revenue / max) * 100),
      })),
    );
  }

  exportCsv(): void {
    const r = this.reports();
    if (!r) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Revenue', r.totalRevenue],
      ['Completed Visits', r.completedVisitsCount],
      ['New Patients', r.newPatientsCount],
      ...r.revenueByService.map((s) => [s.serviceName, s.revenue]),
    ];
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clinic-reports.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
