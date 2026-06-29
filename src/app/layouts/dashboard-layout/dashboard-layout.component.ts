import { Component, HostListener } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="bg-bg selection:bg-primary/20 relative flex h-screen overflow-hidden">
      <!-- Decorative background glows -->
      <div
        class="bg-primary pointer-events-none absolute -top-40 -right-40 z-0 h-96 w-96 rounded-full opacity-10 blur-[100px] transition-opacity duration-1000 dark:opacity-20"
      ></div>
      <div
        class="bg-primary pointer-events-none absolute bottom-0 left-60 z-0 h-96 w-96 rounded-full opacity-10 blur-[100px] transition-opacity duration-1000 dark:opacity-20"
      ></div>

      <!-- Mobile sidebar overlay -->
      @if (showMobileSidebar) {
        <div
          class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          (click)="showMobileSidebar = false"
        ></div>
      }

      <!-- Sidebar: always visible on md+, slide-in on mobile -->
      <app-sidebar
        class="z-50 shrink-0 shadow-lg transition-transform duration-300 md:translate-x-0"
        [class.fixed]="true"
        [class.inset-y-0]="true"
        [class.start-0]="true"
        [class.md:relative]="true"
        [class.translate-x-0]="showMobileSidebar"
        [class.-translate-x-full]="!showMobileSidebar"
        [class.md:translate-x-0]="true"
      ></app-sidebar>

      <div class="relative z-10 flex w-full flex-1 flex-col overflow-hidden">
        <app-header></app-header>
        <main class="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-6 lg:p-8">
          <div
            class="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 ease-out"
          >
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  showMobileSidebar = false;

  @HostListener('window:toggle-mobile-sidebar')
  onToggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  @HostListener('window:close-mobile-sidebar')
  onCloseMobileSidebar() {
    this.showMobileSidebar = false;
  }
}
