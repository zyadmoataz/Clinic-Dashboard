import { Component, ElementRef, viewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ClinicReports } from '../../core/models';
import type { Chart } from 'chart.js';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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

  noShowThisMonth = 6.2;
  noShowLastMonth = 7.6;
  noShowTarget = 8;

  statusMix = [
    { key: 'confirmed', pct: 61, dot: 'bg-[#10b981]' },
    { key: 'completed', pct: 22, dot: 'bg-[#34d399]' },
    { key: 'awaiting_payment', pct: 10, dot: 'bg-[#f59e0b]' },
    { key: 'no_show', pct: 7, dot: 'bg-[#ef4444]' },
  ];

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
          this.buildServiceBars(clinicReports);
        }
        this.loading.set(false);
        this.initCharts();
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
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

    if (this.doughnutCanvas()?.nativeElement) {
      this.doughnutChart?.destroy();
      this.doughnutChart = new Chart(this.doughnutCanvas()!.nativeElement, {
        type: 'doughnut',
        data: {
          labels: [
            this.translate.instant('reports.status.confirmed') || 'Confirmed',
            this.translate.instant('reports.status.completed') || 'Completed',
            this.translate.instant('reports.status.awaiting_payment') || 'Awaiting payment',
            this.translate.instant('reports.status.no_show') || 'No-show / cancelled',
          ],
          datasets: [
            {
              data: [61, 22, 10, 7],
              backgroundColor: ['#10b981', '#34d399', '#f59e0b', '#ef4444'],
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` } },
          },
        },
      });
    }

    if (this.barCanvas()?.nativeElement) {
      this.barChart?.destroy();
      this.barChart = new Chart(this.barCanvas()!.nativeElement, {
        type: 'bar',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4'],
          datasets: [
            {
              data: this.weekValues(),
              backgroundColor: '#10b981',
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` EGP ${Number(ctx.raw).toLocaleString()}` } },
          },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: {
              min: 0,
              grid: { color: '#f1f5f9' },
              border: { display: false },
              ticks: { callback: (v) => `${Number(v) / 1000}k` },
            },
          },
        },
      });
    }
  }

  private buildServiceBars(data: ClinicReports): void {
    if (!data.revenueByService?.length) return;
    const max = Math.max(...data.revenueByService.map((s) => s.revenue));
    this.serviceBars.set(
      data.revenueByService.map((s) => ({
        name: s.serviceName,
        revenue: s.revenue,
        pct: Math.round((s.revenue / max) * 100),
      })),
    );
  }

  exportCsv(): void {
    const currentReports = this.reports();
    if (!currentReports) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Revenue', currentReports.totalRevenue],
      ['Completed Visits', currentReports.completedVisitsCount],
      ['New Patients', currentReports.newPatientsCount],
      ...currentReports.revenueByService.map((s) => [s.serviceName, s.revenue]),
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
