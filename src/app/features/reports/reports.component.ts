// ==========================================
// OWNER: Othman
// ==========================================
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ClinicReports } from '../../core/models';
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
} from 'chart.js';

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

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit, AfterViewInit {
  private api = inject(ApiService);

  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  private doughnutChart?: Chart;
  private barChart?: Chart;

  reports: ClinicReports | null = null;
  loading = true;
  error = false;

  noShowThisMonth = 6.2;
  noShowLastMonth = 7.6;
  noShowTarget = 8;

  statusMix = [
    { label: 'Confirmed', pct: 61, dot: 'bg-[#10b981]' },
    { label: 'Completed', pct: 22, dot: 'bg-[#34d399]' },
    { label: 'Awaiting payment', pct: 10, dot: 'bg-[#f59e0b]' },
    { label: 'No-show / cancelled', pct: 7, dot: 'bg-[#ef4444]' },
  ];

  serviceBars: { name: string; revenue: number; pct: number }[] = [];
  weekValues: number[] = [];

  ngOnInit(): void {
    // TODO: remove mock when backend fixes /api/admin/reports
    const mock: ClinicReports = {
      totalRevenue: 248500,
      completedVisitsCount: 252,
      newPatientsCount: 38,
      revenueByService: [
        { serviceName: 'Dermatology', revenue: 98000 },
        { serviceName: 'Cardiology', revenue: 74000 },
        { serviceName: 'Orthopedics', revenue: 76500 },
      ],
    };
    this.reports = mock;
    this.weekValues = [0.22, 0.27, 0.24, 0.27].map((s) => Math.round(mock.totalRevenue * s));
    this.buildServiceBars(mock);
    this.loading = false;

    // this.api.getReports().subscribe({
    //   next: (data) => {
    //     this.reports = data;
    //     this.weekValues = [0.22, 0.27, 0.24, 0.27].map(s => Math.round(data.totalRevenue * s));
    //     this.buildServiceBars(data);
    //     this.loading = false;
    //     setTimeout(() => this.initCharts(), 0);
    //   },
    //   error: () => { this.error = true; this.loading = false; },
    // });
  }

  ngAfterViewInit(): void {
    // Slight delay to ensure canvas elements are in DOM
    setTimeout(() => this.initCharts(), 0);
  }

  private initCharts(): void {
    if (this.doughnutCanvas?.nativeElement) {
      this.doughnutChart?.destroy();
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Confirmed', 'Completed', 'Awaiting payment', 'No-show / cancelled'],
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
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` } },
          },
        },
      });
    }

    if (this.barCanvas?.nativeElement) {
      this.barChart?.destroy();
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4'],
          datasets: [
            {
              data: this.weekValues,
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
    this.serviceBars = data.revenueByService.map((s) => ({
      name: s.serviceName,
      revenue: s.revenue,
      pct: Math.round((s.revenue / max) * 100),
    }));
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
