import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TransportService } from '../../../core/services/transport.service';
import { resetStaffDb } from '../../../core/mock/clinic-mock.store';
import {
  AvatarComponent,
  LanguageToggleComponent,
  ThemeToggleComponent,
} from '../../../shared/components';

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
      class="bg-surface/85 border-border sticky top-0 z-30 flex h-[68px] items-center justify-between border-b px-4 shadow-sm backdrop-blur-xl sm:px-6"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          class="text-muted hover:bg-surface-2 hover:text-text flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl md:hidden"
          (click)="toggleMobileMenu()"
        >
          <lucide-icon name="menu" class="h-5 w-5"></lucide-icon>
        </button>

        <div
          class="bg-surface-2 border-border hidden items-center gap-2 rounded-full border px-3 py-1 text-xs sm:inline-flex"
        >
          <lucide-icon name="database" class="text-primary h-3.5 w-3.5"></lucide-icon>
          <span class="text-muted font-medium">
            {{
              transport.source() === 'live-api' ? 'Synced: Mock API (:5000)' : 'Local Browser Mock'
            }}
          </span>
          <button
            type="button"
            (click)="onResetDemo()"
            class="text-primary inline-flex cursor-pointer items-center gap-1 font-bold hover:underline"
          >
            <lucide-icon name="rotate-ccw" class="h-3 w-3"></lucide-icon>
            Reset
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2.5 sm:gap-4">
        <app-theme-toggle></app-theme-toggle>
        <app-language-toggle></app-language-toggle>

        <div class="bg-border hidden h-7 w-px sm:block"></div>

        <div class="relative">
          <button
            type="button"
            class="group hover:bg-surface-2 flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5"
            (click)="showUserMenu = !showUserMenu"
          >
            <div class="hidden text-end sm:block">
              <p class="text-text text-xs font-bold">{{ currentUser?.displayName || 'Staff' }}</p>
              <p class="text-muted text-[11px] capitalize">{{ currentUser?.role || 'Staff' }}</p>
            </div>
            <app-avatar
              [name]="currentUser?.displayName || currentUser?.role || 'S'"
              size="sm"
            ></app-avatar>
            <lucide-icon
              name="chevron-down"
              class="text-muted hidden h-4 w-4 transition-transform sm:block"
              [ngClass]="{ 'rotate-180': showUserMenu }"
            ></lucide-icon>
          </button>

          @if (showUserMenu) {
            <div
              class="border-border bg-surface absolute end-0 top-full mt-2 w-56 rounded-xl border p-1.5 shadow-lg"
            >
              <div class="border-border border-b px-3 py-2.5">
                <p class="text-text text-sm font-bold">{{ currentUser?.displayName || 'Staff' }}</p>
                <p class="text-muted truncate text-xs">{{ currentUser?.email || '' }}</p>
              </div>
              <a
                routerLink="/staff/profile"
                class="text-text hover:bg-surface-2 mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium"
                (click)="showUserMenu = false"
              >
                <lucide-icon name="user" class="text-muted h-4 w-4"></lucide-icon>
                {{ 'header.profile' | translate }}
              </a>
              <button
                type="button"
                class="text-danger hover:bg-danger-soft mt-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold"
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
  transport = inject(TransportService);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  router = inject(Router);

  showUserMenu = false;

  get currentUser() {
    return this.authService.currentUser();
  }

  toggleMobileMenu() {
    window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
  }

  onResetDemo() {
    this.apiService.resetDemo().subscribe({
      next: () => {
        resetStaffDb();
        this.toastService.success('Demo data restored.');
        window.location.reload();
      },
      error: () => {
        resetStaffDb();
        window.location.reload();
      },
    });
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
