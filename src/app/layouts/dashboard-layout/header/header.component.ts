import { Component, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  AvatarComponent,
  LanguageToggleComponent,
  ThemeToggleComponent,
} from '../../../shared/components';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    LucideAngularModule,
    AvatarComponent,
    LanguageToggleComponent,
    ThemeToggleComponent,
    TranslatePipe,
    CommonModule,
  ],
  template: `
    <header
      class="bg-surface/70 border-border/50 glass sticky top-0 z-30 flex h-[72px] items-center justify-between border-b px-4 shadow-sm backdrop-blur-xl sm:px-6"
    >
      <div class="flex items-center">
        <!-- Mobile menu button -->
        <button
          class="mr-3 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] md:hidden"
          (click)="toggleMobileMenu()"
        >
          <lucide-icon name="menu" class="h-5 w-5"></lucide-icon>
        </button>
      </div>

      <div class="flex items-center gap-3 sm:gap-5">
        <div class="flex items-center gap-2">
          <app-theme-toggle></app-theme-toggle>
          <app-language-toggle></app-language-toggle>
        </div>

        <div class="bg-border-strong hidden h-8 w-[1px] opacity-50 sm:block"></div>

        <!-- User profile dropdown trigger -->
        <div class="relative">
          <button
            class="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition-all hover:bg-[var(--color-surface-2)]"
            (click)="toggleUserMenu()"
          >
            <div class="hidden text-right sm:block">
              <p
                class="text-text group-hover:text-primary text-sm leading-tight font-bold capitalize transition-colors"
              >
                {{ currentUser?.role || 'Guest' }}
              </p>
            </div>
            <div
              class="ring-border group-hover:ring-primary/50 rounded-full transition-all duration-300 group-hover:ring-2"
            >
              <app-avatar [name]="currentUser?.role || 'Guest'" size="sm"></app-avatar>
            </div>
            <lucide-icon
              name="chevron-down"
              class="text-muted hidden h-4 w-4 transition-transform sm:block"
              [ngClass]="{ 'rotate-180': showUserMenu }"
            ></lucide-icon>
          </button>

          <!-- Dropdown menu -->
          @if (showUserMenu) {
            <div
              class="absolute end-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-[var(--color-surface)] p-1.5 shadow-lg dark:border-slate-700"
            >
              <!-- User info -->
              <div class="border-b border-slate-100 px-3 py-3 dark:border-slate-700">
                <p class="text-sm font-semibold text-[var(--color-text)] capitalize">
                  {{ currentUser?.role || 'Guest' }}
                </p>
                <p class="text-xs text-[var(--color-muted)]">{{ currentUser?.email || '' }}</p>
              </div>

              <!-- Profile link -->
              <a
                routerLink="/staff/profile"
                class="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
                (click)="showUserMenu = false"
              >
                <lucide-icon name="user" class="h-4 w-4 text-[var(--color-muted)]"></lucide-icon>
                {{ 'header.profile' | translate }}
              </a>

              <!-- Separator -->
              <div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>

              <!-- Logout -->
              <button
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                (click)="onLogout()"
              >
                <lucide-icon name="log-out" class="h-4 w-4"></lucide-icon>
                {{ 'logout.button' | translate }}
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  router = inject(Router);

  showUserMenu = false;

  get currentUser() {
    return this.authService.currentUser();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu() {
    // Dispatch custom event so the layout can listen and toggle the sidebar
    window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
  }

  onLogout() {
    this.showUserMenu = false;
    this.authService.logout();
    this.toastService.success(
      this.translate.instant('logout.success'),
      this.translate.instant('logout.message'),
    );
    this.router.navigate(['/staff/login']);
  }
}
