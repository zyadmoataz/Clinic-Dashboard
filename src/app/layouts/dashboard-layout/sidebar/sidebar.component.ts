import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LucideAngularModule],
  template: `
    <aside class="bg-surface border-border flex h-screen w-64 flex-col border-r transition-all">
      <div class="border-border flex h-16 items-center border-b px-6">
        <div class="flex items-center gap-2">
          <div class="bg-primary text-on-primary rounded-md p-1.5 text-lg leading-none font-bold">
            U&
          </div>
          <h1 class="text-text leading-tight font-bold tracking-tight">Clarity Clinic</h1>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <!-- Administration -->
        <div>
          <h2 class="text-faint mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
            Administration
          </h2>
          <nav class="flex flex-col gap-1">
            <a
              routerLink="/staff/dashboard"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="layout-dashboard" class="h-4 w-4"></lucide-icon>
              {{ 'header.dashboard' | translate }}
            </a>
            <a
              routerLink="/staff/staff"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="users" class="h-4 w-4"></lucide-icon>
              {{ 'header.staff' | translate }}
            </a>
            <a
              routerLink="/staff/services"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="stethoscope" class="h-4 w-4"></lucide-icon>
              {{ 'header.services' | translate }}
            </a>
            <a
              routerLink="/staff/availability"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="clock" class="h-4 w-4"></lucide-icon>
              {{ 'header.availability' | translate }}
            </a>
            <a
              routerLink="/staff/reports"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="bar-chart-3" class="h-4 w-4"></lucide-icon>
              {{ 'header.reports' | translate }}
            </a>
          </nav>
        </div>

        <!-- Front Desk -->
        <div>
          <h2 class="text-faint mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
            Front Desk
          </h2>
          <nav class="flex flex-col gap-1">
            <a
              routerLink="/staff/calendar"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="calendar" class="h-4 w-4"></lucide-icon>
              {{ 'header.calendar' | translate }}
            </a>
            <a
              routerLink="/staff/walk-in"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="door-open" class="h-4 w-4"></lucide-icon>
              {{ 'header.walk_in' | translate }}
            </a>
            <a
              routerLink="/staff/patients"
              routerLinkActive="bg-primary-soft text-primary font-medium"
              class="text-muted hover:bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <lucide-icon name="contact" class="h-4 w-4"></lucide-icon>
              {{ 'header.patients' | translate }}
            </a>
          </nav>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {}
