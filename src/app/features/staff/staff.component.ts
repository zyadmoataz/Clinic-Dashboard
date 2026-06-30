import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

import { DataTableComponent } from '../../shared/components/data-table.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [DataTableComponent, ButtonComponent, TranslatePipe],
  templateUrl: './staff.component.html',
})
export class StaffComponent {
  staffList = signal<{ id: string; cells: (string | number | boolean | null | undefined)[] }[]>([]);
  isLoading = signal(false);

  columns = [
    { key: 'name', label: 'staff.columns.name' },
    { key: 'role', label: 'staff.columns.role' },
    { key: 'specialty', label: 'staff.columns.specialty' },
    { key: 'isActive', label: 'staff.columns.status' },
  ];

  private apiService = inject(ApiService);
  private router = inject(Router);

  constructor() {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading.set(true);

    this.apiService.getStaff().subscribe({
      next: (staffListResponse) => {
        this.staffList.set(
          staffListResponse.map((staff) => ({
            id: staff.id,
            cells: [staff.name, staff.role, staff.specialization, staff.isActive],
          })),
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
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
