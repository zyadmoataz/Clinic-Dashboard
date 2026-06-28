// ==========================================
// OWNER: Helda
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Staff } from '../../core/models';

import { DataTableComponent } from '../../shared/components/data-table.component';
import { SearchInputComponent } from '../../shared/components/search-input.component';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './staff.html',
  styleUrls: ['./staff.css'],
})
export class StaffComponent implements OnInit {
  staffList: Staff[] = [];
  isLoading = false;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'isActive', label: 'Status' },
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading = true;

    this.apiService.getStaff().subscribe({
      next: (data) => {
        this.staffList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
  goToAddDoctor(): void {
    this.router.navigate(['/staff/add-doctor']);
  }
}
