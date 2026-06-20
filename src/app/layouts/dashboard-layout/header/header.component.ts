import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  ButtonComponent,
  AvatarComponent,
  LanguageToggleComponent,
  ThemeToggleComponent,
} from '../../../shared/components';

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
      class="bg-surface border-border sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6"
    >
      <div class="flex items-center">
        <!-- Optional mobile menu trigger could go here -->
      </div>

      <div class="flex items-center gap-4">
        <app-theme-toggle></app-theme-toggle>

        <app-language-toggle></app-language-toggle>

        <div class="bg-border-strong mx-1 h-6 w-px"></div>

        <div class="flex items-center gap-3 pl-1">
          <div class="hidden text-right sm:block">
            <p class="text-text text-sm leading-tight font-bold">Admin User</p>
            <p class="text-muted text-xs leading-tight">Administrator</p>
          </div>
          <app-avatar name="Admin User" size="sm"></app-avatar>
        </div>

        <app-button
          variant="ghost"
          class="text-danger hover:bg-danger-soft hover:text-danger ml-2"
          title="Sign out"
        >
          <lucide-icon name="log-out" class="h-5 w-5"></lucide-icon>
        </app-button>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
