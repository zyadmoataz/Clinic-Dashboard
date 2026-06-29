// ==========================================
// OWNER: Zyad
// ==========================================
import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models';
import { PageHeaderComponent, InputComponent, AvatarComponent } from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    LucideAngularModule,
    PageHeaderComponent,
    InputComponent,
    LoadingComponent,
    AvatarComponent,
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
      email: [''],
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
}
