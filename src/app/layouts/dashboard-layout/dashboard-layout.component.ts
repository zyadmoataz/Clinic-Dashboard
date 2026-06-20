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
    <div class="bg-bg flex h-screen overflow-hidden">
      <app-sidebar class="z-40 hidden shrink-0 md:block"></app-sidebar>
      <div class="relative flex w-full flex-1 flex-col overflow-hidden">
        <app-header></app-header>
        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="container-main mx-auto max-w-[1200px]">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {}
