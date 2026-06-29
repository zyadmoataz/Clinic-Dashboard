import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LucideAngularModule],
  template: `
    <aside
      class="bg-surface/80 border-border glass flex h-screen w-64 flex-col border-r transition-all"
    >
      <!-- Logo Area -->
      <div class="border-border/50 flex h-[72px] items-center border-b px-6">
        <div
          class="group flex cursor-pointer items-center gap-3 transition-transform hover:scale-[1.02]"
        >
          <div
            class="from-primary to-primary-hover shadow-glow ring-primary/20 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg leading-none font-black text-white ring-2"
          >
            ✦
          </div>
          <h1 class="text-text text-xl leading-tight font-extrabold tracking-tight">
            Clarity <span class="text-primary font-medium">Clinic</span>
          </h1>
        </div>
      </div>

      <!-- Navigation Area -->
      <div class="flex flex-1 flex-col gap-6 overflow-y-auto scroll-smooth px-4 py-6">
        <!-- Administration (Admin Only) -->
        @if (role === 'admin') {
          <div>
            <h2 class="text-faint mb-3 px-2 text-xs font-bold tracking-[0.2em] uppercase">
              Administration
            </h2>
            <nav class="flex flex-col gap-1.5">
              <a
                routerLink="/staff/dashboard"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="layout-dashboard"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.dashboard' | translate }}
              </a>
              <a
                routerLink="/staff/staff"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="users"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.staff' | translate }}
              </a>
              <a
                routerLink="/staff/services"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="stethoscope"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.services' | translate }}
              </a>
              <a
                routerLink="/staff/availability"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="clock"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.availability' | translate }}
              </a>
              <a
                routerLink="/staff/reports"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="bar-chart-3"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.reports' | translate }}
              </a>
            </nav>
          </div>
        }

        <!-- Front Desk (Admin & Receptionist) -->
        @if (role === 'admin' || role === 'receptionist') {
          <div>
            <h2 class="text-faint mb-3 px-2 text-xs font-bold tracking-[0.2em] uppercase">
              Front Desk
            </h2>
            <nav class="flex flex-col gap-1.5">
              @if (role === 'receptionist') {
                <a
                  routerLink="/staff/dashboard"
                  routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                  class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
                >
                  <lucide-icon
                    name="layout-dashboard"
                    class="h-4 w-4 transition-transform group-hover:scale-110"
                  ></lucide-icon>
                  {{ 'header.dashboard' | translate }}
                </a>
              }
              <a
                routerLink="/staff/calendar"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="calendar"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.calendar' | translate }}
              </a>
              <a
                routerLink="/staff/walk-in"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="door-open"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.walk_in' | translate }}
              </a>
              <a
                routerLink="/staff/patients"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="contact"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                {{ 'header.patients' | translate }}
              </a>
              @if (role === 'receptionist') {
                <a
                  routerLink="/staff/services"
                  routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                  class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
                >
                  <lucide-icon
                    name="stethoscope"
                    class="h-4 w-4 transition-transform group-hover:scale-110"
                  ></lucide-icon>
                  {{ 'header.services' | translate }}
                </a>
                <a
                  routerLink="/staff/availability"
                  routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                  class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
                >
                  <lucide-icon
                    name="clock"
                    class="h-4 w-4 transition-transform group-hover:scale-110"
                  ></lucide-icon>
                  {{ 'header.availability' | translate }}
                </a>
              }
            </nav>
          </div>
        }

        <!-- Clinic (Doctor Only) -->
        @if (role === 'doctor') {
          <div>
            <h2 class="text-faint mb-3 px-2 text-xs font-bold tracking-[0.2em] uppercase">
              Clinic
            </h2>
            <nav class="flex flex-col gap-1.5">
              <a
                routerLink="/staff/schedule"
                routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
              >
                <lucide-icon
                  name="calendar"
                  class="h-4 w-4 transition-transform group-hover:scale-110"
                ></lucide-icon>
                My schedule
              </a>
            </nav>
          </div>
        }

        <!-- Profile Section -->
        <div>
          <h2 class="text-faint mb-3 px-2 text-xs font-bold tracking-[0.2em] uppercase">Profile</h2>
          <nav class="flex flex-col gap-1.5">
            <a
              routerLink="/staff/profile"
              routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
              class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
            >
              <lucide-icon
                name="user"
                class="h-4 w-4 transition-transform group-hover:scale-110"
              ></lucide-icon>
              Profile
            </a>
          </nav>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  authService = inject(AuthService);

  get role() {
    return this.authService.currentUser()?.role?.toLowerCase() || '';
  }
}
