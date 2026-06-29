// ==========================================
// OWNER: Zyad
// ==========================================
import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models';
import { PageHeaderComponent, ButtonComponent, InputComponent } from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    LucideAngularModule,
    PageHeaderComponent,
    ButtonComponent,
    InputComponent,
    LoadingComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  profileForm!: FormGroup;
  currentUser = signal<User | null>(null);
  loading = signal(true);
  saving = signal(false);
  editing = signal(false);

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.profileForm.disable();

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.api.getMe().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.profileForm.patchValue({
          displayName: user.displayName,
          email: user.email,
        });
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error(this.translate.instant('profile.load_failed'));
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  toggleEdit(): void {
    this.editing.set(!this.editing());
    if (this.editing()) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      if (this.currentUser()) {
        // Revert changes
        this.profileForm.patchValue({
          displayName: this.currentUser()!.displayName,
          email: this.currentUser()!.email,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.saving()) return;

    this.saving.set(true);
    const updatedData = this.profileForm.value;

    this.api.updateProfile(updatedData).subscribe({
      next: (updatedUser) => {
        this.currentUser.set(updatedUser);
        this.editing.set(false);
        this.profileForm.disable();
        this.saving.set(false);
        this.toast.success(this.translate.instant('profile.update_success'));
      },
      error: () => {
        this.saving.set(false);
        this.toast.error(this.translate.instant('profile.update_failed'));
      },
    });
  }
}
