// ==========================================
// OWNER: Helda
// ==========================================
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Staff } from '../../core/models';

import { DataTableComponent } from '../../shared/components/data-table.component';
import { SearchInputComponent } from '../../shared/components/search-input.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [DataTableComponent, ButtonComponent, TranslatePipe],
  templateUrl: './staff.component.html',
})
export class StaffComponent implements OnInit {
  staffList: { id: string; cells: any[] }[] = [];
  isLoading = false;

  columns = [
    { key: 'name', label: 'staff.columns.name' },
    { key: 'role', label: 'staff.columns.role' },
    { key: 'specialty', label: 'staff.columns.specialty' },
    { key: 'isActive', label: 'staff.columns.status' },
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading = true;

    this.apiService.getStaff().subscribe({
      next: (data) => {
        this.staffList = data.map((staff) => ({
          id: staff.id,
          cells: [staff.name, staff.role, staff.specialization, staff.isActive],
        })) as any;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
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
