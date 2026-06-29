import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ReceptionistDashboardComponent } from './receptionist/receptionist-dashboard.component';
import { DoctorDashboardComponent } from './doctor/doctor-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminDashboardComponent, ReceptionistDashboardComponent, DoctorDashboardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private auth = inject(AuthService);
  role = computed(() => this.auth.currentUser()?.role?.toLowerCase() ?? '');
}
