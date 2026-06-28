// ==========================================
// OWNER: Othman
// ==========================================
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (role !== 'doctor') {
      <div class="space-y-6">
        <div>
          <h2 class="text-text text-2xl font-bold tracking-tight">Dashboard</h2>
          <p class="text-muted text-sm">Clinic performance at a glance.</p>
        </div>

        <!-- Metrics Row -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            class="bg-surface border-border flex flex-col justify-between rounded-xl border p-5 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg"
              >
                <lucide-icon name="calendar" class="h-4 w-4"></lucide-icon>
              </div>
              <span class="text-muted text-sm font-medium">Today's appointments</span>
            </div>
            <div class="mt-4 text-3xl font-black">7</div>
          </div>

          <div
            class="bg-surface border-border flex flex-col justify-between rounded-xl border p-5 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg"
              >
                <lucide-icon name="check" class="h-4 w-4"></lucide-icon>
              </div>
              <span class="text-muted text-sm font-medium">Confirmed</span>
            </div>
            <div class="mt-4 text-3xl font-black">3</div>
          </div>

          <div
            class="bg-surface border-border flex flex-col justify-between rounded-xl border p-5 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg"
              >
                <lucide-icon name="user" class="h-4 w-4"></lucide-icon>
              </div>
              <span class="text-muted text-sm font-medium">Checked in</span>
            </div>
            <div class="mt-4 text-3xl font-black">0</div>
          </div>

          <div
            class="bg-surface border-border flex flex-col justify-between rounded-xl border p-5 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg"
              >
                <lucide-icon name="trending-up" class="h-4 w-4"></lucide-icon>
              </div>
              <span class="text-muted text-sm font-medium">Today's revenue</span>
            </div>
            <div class="mt-4 text-3xl font-black">50 <span class="text-lg">EGP</span></div>
          </div>
        </div>

        <!-- Charts Row (Admin Only) -->
        @if (role === 'admin') {
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              class="bg-surface border-border flex h-64 flex-col rounded-xl border p-5 shadow-sm"
            >
              <h3 class="text-text text-sm font-bold">Appointments by status</h3>
              <div class="flex flex-1 items-center justify-center">
                <span class="text-muted text-sm">Chart Placeholder</span>
              </div>
            </div>

            <div
              class="bg-surface border-border flex h-64 flex-col rounded-xl border p-5 shadow-sm"
            >
              <h3 class="text-text text-sm font-bold">Doctor utilization</h3>
              <div class="flex flex-1 items-center justify-center">
                <span class="text-muted text-sm">Chart Placeholder</span>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  get role() {
    return this.authService.currentUser()?.role || '';
  }

  ngOnInit() {
    if (this.role === 'doctor') {
      this.router.navigate(['/staff/schedule']);
    }
  }
}
