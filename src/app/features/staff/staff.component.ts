import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { Staff } from '../../core/models';
import {
  DataTableCellType,
  DataTableComponent,
} from '../../shared/components/data-table.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { SearchInputComponent } from '../../shared/components/search-input.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    DataTableComponent,
    ButtonComponent,
    SearchInputComponent,
    TranslatePipe,
  ],
  templateUrl: './staff.component.html',
})
export class StaffComponent {
  rawStaff = signal<Staff[]>([]);
  roleFilter = signal<'all' | 'doctor' | 'receptionist' | 'admin'>('all');
  searchTerm = signal<string>('');
  isLoading = signal(false);

  columns = [
    { key: 'name', label: 'staff.columns.name' },
    { key: 'role', label: 'staff.columns.role' },
    { key: 'specialty', label: 'staff.columns.specialty' },
    { key: 'isActive', label: 'staff.columns.status' },
  ];
  columnTypes: DataTableCellType[] = ['avatar', 'role', 'text', 'boolean'];

  doctorCount = computed(
    () => this.rawStaff().filter((s) => s.role.toLowerCase() === 'doctor').length,
  );
  supportCount = computed(
    () => this.rawStaff().filter((s) => s.role.toLowerCase() !== 'doctor').length,
  );

  staffList = computed(() => {
    const rf = this.roleFilter();
    const q = this.searchTerm().trim().toLowerCase();
    return this.rawStaff()
      .filter((s) => {
        if (rf !== 'all' && s.role.toLowerCase() !== rf) return false;
        if (!q) return true;
        return `${s.name} ${s.role} ${s.specialization || ''}`.toLowerCase().includes(q);
      })
      .map((s) => ({
        id: s.id,
        cells: [s.name, s.role, s.specialization, s.isActive],
      }));
  });

  private apiService = inject(ApiService);
  private router = inject(Router);

  constructor() {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading.set(true);
    this.apiService.getStaff().subscribe({
      next: (staffListResponse) => {
        this.rawStaff.set(staffListResponse);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  goToAddDoctor(): void {
    this.router.navigate(['/staff/add-doctor']);
  }

  goToAddreciptionist(): void {
    this.router.navigate(['/staff/add-receptionist']);
  }
}
