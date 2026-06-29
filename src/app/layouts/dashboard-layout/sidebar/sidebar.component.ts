import { Component, inject, computed } from '@angular/core';

import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, TranslatePipe, LucideAngularModule],
  template: `
    <aside
      class="border-border flex h-screen w-64 flex-col border-r bg-[var(--color-surface)] shadow-2xl transition-all max-md:rounded-r-2xl md:rounded-none md:shadow-none"
    >
      <!-- Logo Area -->
      <div class="border-border/50 flex h-[72px] items-center justify-between border-b px-6">
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
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] md:hidden"
          (click)="closeSidebar()"
        >
          <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
        </button>
      </div>

      <!-- Navigation Area -->
      <div class="flex flex-1 flex-col gap-6 overflow-y-auto scroll-smooth px-4 py-6">
        @for (group of navGroups(); track group.title) {
          <div>
            <h2 class="text-faint mb-3 px-2 text-xs font-bold tracking-[0.2em] uppercase">
              {{ group.title | translate }}
            </h2>
            <nav class="flex flex-col gap-1.5">
              @for (item of group.items; track item.link) {
                <a
                  [routerLink]="item.link"
                  routerLinkActive="bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm"
                  class="group text-muted hover:bg-surface-2 hover:text-text relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
                  (click)="closeSidebar()"
                >
                  <lucide-icon
                    [name]="item.icon"
                    class="h-4 w-4 transition-transform group-hover:scale-110"
                  ></lucide-icon>
                  {{ item.label | translate }}
                </a>
              }
            </nav>
          </div>
        }
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  authService = inject(AuthService);

  role = computed(() => this.authService.currentUser()?.role?.toLowerCase() || '');

  navGroups = computed(() => {
    const currentRole = this.role();
    const groups = [];

    // Administration Group
    if (currentRole === 'admin') {
      groups.push({
        title: 'sidebar.administration',
        items: [
          { link: '/staff/dashboard', icon: 'layout-dashboard', label: 'header.dashboard' },
          { link: '/staff/staff', icon: 'users', label: 'header.staff' },
          { link: '/staff/services', icon: 'stethoscope', label: 'header.services' },
          { link: '/staff/availability', icon: 'clock', label: 'header.availability' },
          { link: '/staff/reports', icon: 'bar-chart-3', label: 'header.reports' },
        ],
      });
    }

    // Front Desk Group
    if (currentRole === 'admin' || currentRole === 'receptionist') {
      const frontDeskItems = [];
      if (currentRole === 'receptionist') {
        frontDeskItems.push({
          link: '/staff/dashboard',
          icon: 'layout-dashboard',
          label: 'header.dashboard',
        });
      }
      frontDeskItems.push(
        { link: '/staff/calendar', icon: 'calendar', label: 'header.calendar' },
        { link: '/staff/walk-in', icon: 'door-open', label: 'header.walk_in' },
        { link: '/staff/patients', icon: 'contact', label: 'header.patients' },
      );
      if (currentRole === 'receptionist') {
        frontDeskItems.push(
          { link: '/staff/services', icon: 'stethoscope', label: 'header.services' },
          { link: '/staff/availability', icon: 'clock', label: 'header.availability' },
        );
      }

      groups.push({
        title: 'sidebar.front_desk',
        items: frontDeskItems,
      });
    }

    // Clinic Group
    if (currentRole === 'doctor') {
      groups.push({
        title: 'sidebar.clinic',
        items: [{ link: '/staff/schedule', icon: 'calendar', label: 'sidebar.my_schedule' }],
      });
    }

    // Profile Group
    groups.push({
      title: 'sidebar.profile_section',
      items: [{ link: '/staff/profile', icon: 'user', label: 'header.profile' }],
    });

    return groups;
  });

  closeSidebar() {
    window.dispatchEvent(new CustomEvent('close-mobile-sidebar'));
  }
}
