import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';

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
            loadComponent: () =>
              import('./features/schedule/schedule.component').then((m) => m.ScheduleComponent),
          },
          {
            path: 'staff',
            loadComponent: () =>
              import('./features/staff/staff.component').then((m) => m.StaffComponent),
          },
          {
            path: 'services',
            loadComponent: () =>
              import('./features/services/services.component').then((m) => m.ServicesComponent),
          },
          {
            path: 'availability',
            loadComponent: () =>
              import('./features/availability/availability.component').then(
                (m) => m.AvailabilityComponent,
              ),
          },
          {
            path: 'reports',
            loadComponent: () =>
              import('./features/reports/reports.component').then((m) => m.ReportsComponent),
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
          },
          {
            path: 'walk-in',
            loadComponent: () =>
              import('./features/walk-in/walk-in.component').then((m) => m.WalkInComponent),
          },
          {
            path: 'patients',
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
