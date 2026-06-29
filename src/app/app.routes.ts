import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'staff/dashboard', pathMatch: 'full' },
  {
    path: 'staff',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
          },
          {
            path: 'schedule',
            canActivate: [roleGuard(['doctor'])],
            loadComponent: () =>
              import('./features/schedule/schedule.component').then((m) => m.ScheduleComponent),
          },
          {
            path: 'staff',
            canActivate: [roleGuard(['admin'])],
            loadComponent: () =>
              import('./features/staff/staff.component').then((m) => m.StaffComponent),
          },
          {
            path: 'add-doctor',
            canActivate: [roleGuard(['admin'])],
            loadComponent: () =>
              import('./features/staff/add-doctor/add-doctor.component').then(
                (m) => m.AddDoctorComponent,
              ),
          },
          {
            path: 'add-receptionist',
            canActivate: [roleGuard(['admin'])],
            loadComponent: () =>
              import('./features/staff/add-receptionist/add-receptionist.component').then(
                (m) => m.AddReceptionistComponent,
              ),
          },
          {
            path: 'services',
            canActivate: [roleGuard(['admin', 'receptionist'])],
            loadComponent: () =>
              import('./features/services/services.component').then((m) => m.ServicesComponent),
          },
          {
            path: 'availability',
            canActivate: [roleGuard(['admin', 'receptionist'])],
            loadComponent: () =>
              import('./features/availability/availability.component').then(
                (m) => m.AvailabilityComponent,
              ),
          },
          {
            path: 'reports',
            canActivate: [roleGuard(['admin'])],
            loadComponent: () =>
              import('./features/reports/reports.component').then((m) => m.ReportsComponent),
          },
          {
            path: 'calendar',
            canActivate: [roleGuard(['admin', 'receptionist'])],
            loadComponent: () =>
              import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
          },
          {
            path: 'walk-in',
            canActivate: [roleGuard(['admin', 'receptionist'])],
            loadComponent: () =>
              import('./features/walk-in/walk-in.component').then((m) => m.WalkInComponent),
          },
          {
            path: 'patients',
            canActivate: [roleGuard(['admin', 'receptionist'])],
            loadComponent: () =>
              import('./features/patients/patients.component').then((m) => m.PatientsComponent),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./features/profile/profile.component').then((m) => m.ProfileComponent),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'staff/dashboard' },
];
