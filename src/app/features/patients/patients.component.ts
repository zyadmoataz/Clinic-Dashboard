// ==========================================
// OWNER: Helda
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Patient } from '../../core/models';
import { SearchInputComponent } from '../../shared/components/search-input.component';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, ButtonComponent],
  templateUrl: './patients.html',
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;
    this.apiService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  onSearch(term: string): void {
    const lower = term.toLowerCase();
    this.filteredPatients = this.patients.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.phone.toLowerCase().includes(lower),
    );
  }
}
