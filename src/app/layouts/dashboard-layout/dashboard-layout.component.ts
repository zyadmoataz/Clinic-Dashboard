import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="bg-bg selection:bg-primary/20 relative flex h-screen overflow-hidden">
      <!-- Decorative background glows -->
      <div
        class="bg-primary pointer-events-none absolute -top-40 -right-40 z-0 h-96 w-96 rounded-full opacity-10 blur-[100px] transition-opacity duration-1000 dark:opacity-20"
      ></div>
      <div
        class="bg-primary pointer-events-none absolute bottom-0 left-60 z-0 h-96 w-96 rounded-full opacity-10 blur-[100px] transition-opacity duration-1000 dark:opacity-20"
      ></div>

      <app-sidebar class="z-40 hidden shrink-0 shadow-lg md:block"></app-sidebar>

      <div class="relative z-10 flex w-full flex-1 flex-col overflow-hidden">
        <app-header></app-header>
        <main class="flex-1 overflow-y-auto scroll-smooth p-6 lg:p-8">
          <div
            class="container-main animate-in fade-in slide-in-from-bottom-4 fill-mode-both mx-auto max-w-[1200px] duration-500 ease-out"
          >
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {}
