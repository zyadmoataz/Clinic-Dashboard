import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  ButtonComponent,
  AvatarComponent,
  LanguageToggleComponent,
  ThemeToggleComponent,
} from '../../../shared/components';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ButtonComponent,
    AvatarComponent,
    LanguageToggleComponent,
    ThemeToggleComponent,
  ],
  template: `
    <header
      class="bg-surface/70 border-border/50 glass sticky top-0 z-30 flex h-[72px] items-center justify-between border-b px-6 shadow-sm backdrop-blur-xl"
    >
      <div class="flex items-center">
        <!-- Optional mobile menu trigger could go here -->
      </div>

      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2">
          <app-theme-toggle class="interactive-hover"></app-theme-toggle>
          <app-language-toggle class="interactive-hover"></app-language-toggle>
        </div>

        <div class="bg-border-strong h-8 w-[1px] opacity-50"></div>

        <div class="group flex cursor-pointer items-center gap-3 pl-1 transition-all">
          <div class="hidden text-right sm:block">
            <p
              class="text-text group-hover:text-primary text-sm leading-tight font-bold transition-colors"
            >
              {{ currentUser?.displayName || 'Unknown User' }}
            </p>
            <p class="text-muted text-xs leading-tight capitalize">
              {{ currentUser?.role || 'Guest' }}
            </p>
          </div>
          <div
            class="ring-border group-hover:ring-primary/50 rounded-full transition-all duration-300 group-hover:ring-2"
          >
            <app-avatar [name]="currentUser?.displayName || 'Unknown'" size="sm"></app-avatar>
          </div>
        </div>

        <app-button
          variant="ghost"
          class="text-danger hover:bg-danger-soft/80 hover:text-danger interactive-hover ml-2 flex h-10 w-10 items-center justify-center rounded-full p-0"
          title="Sign out"
          (clicked)="onSubmit()"
        >
          <lucide-icon name="log-out" class="h-5 w-5"></lucide-icon>
        </app-button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  router = inject(Router);

  get currentUser() {
    return this.authService.currentUser();
  }

  onSubmit() {
    this.authService.logout();
    this.toastService.success('Logout successful', 'You have been logged out');
    this.router.navigate(['/staff/login']);
  }
}
