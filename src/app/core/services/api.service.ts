import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginResponse,
  Doctor,
  Slot,
  DoctorAvailability,
  Service,
  Appointment,
  WalkInBookingRequest,
  RescheduleRequest,
  VisitRecordRequest,
  Visit,
  Patient,
  Staff,
  DoctorRegisterRequest,
  ReceptionistRegisterRequest,
  ClinicReports,
  DashboardStats,
  getDoctorsParams,
  PaginatedDoctorsResponse,
  BlockedDate,
  RegisterRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Auth ──
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/auth/profile`, data);
  }

  // ── Doctors ──

  getDoctors(params?: getDoctorsParams): Observable<PaginatedDoctorsResponse> {
    return this.http.get<PaginatedDoctorsResponse>(`${this.baseUrl}/doctors`, {
      params: params as Record<string, string | number | boolean>,
    });
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/doctors/${id}`);
  }

  getDoctorSlots(id: number, params?: { date?: string; serviceId?: number }): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.baseUrl}/doctors/${id}/slots`, { params });
  }

  getDoctorAvailability(id: string): Observable<DoctorAvailability[]> {
    return this.http.get<DoctorAvailability[]>(`${this.baseUrl}/doctors/${id}/availability`);
  }

  setDoctorAvailability(id: string, data: Array<Omit<DoctorAvailability, 'id'>>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/doctors/${id}/availability`, data);
  }

  getDoctorBlockedDates(id: string): Observable<BlockedDate[]> {
    return this.http.get<BlockedDate[]>(`${this.baseUrl}/doctors/${id}/blocked-dates`);
  }

  createDoctorBlockedDate(id: string, data: Omit<BlockedDate, 'id'>): Observable<BlockedDate> {
    return this.http.post<BlockedDate>(`${this.baseUrl}/doctors/${id}/blocked-dates`, data);
  }

  deleteDoctorBlockedDate(id: string, date: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/doctors/${id}/blocked-dates/${date}`);
  }

  // ── Services ──
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/services`);
  }

  createService(data: Omit<Service, 'id' | 'doctorName'>): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}/services`, data);
  }

  updateService(
    id: number,
    data: Omit<Service, 'id' | 'doctorName' | 'doctorId'>,
  ): Observable<Service> {
    return this.http.put<Service>(`${this.baseUrl}/services/${id}`, data);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/services/${id}`);
  }

  // ── Appointments (Front desk) ──
  getAppointments(params?: { date?: string }): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments`, { params });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/appointments/${id}`);
  }

  bookWalkIn(data: WalkInBookingRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/walk-in`, data);
  }

  rescheduleAppointment(id: number, data: RescheduleRequest): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}/reschedule`, data);
  }

  markArrived(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}/arrived`, {});
  }

  markNoShow(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}/no-show`, {});
  }

  markCashPaid(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}/cash-paid`, {});
  }

  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}/cancel`, {});
  }

  // ── Doctor Clinical ──
  getDoctorSchedule(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/doctor/schedule`);
  }

  completeAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}/complete`, {});
  }

  recordVisit(appointmentId: number, data: VisitRecordRequest): Observable<Visit> {
    return this.http.post<Visit>(`${this.baseUrl}/appointments/${appointmentId}/visit`, data);
  }

  getPatientHistory(patientId: number): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.baseUrl}/patients/${patientId}/history`);
  }

  // ── Patients ──
  getPatients(params?: { search?: string }): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patients`, { params });
  }

  createPatient(data: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/patients`, data);
  }

  // ── Admin ──
  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.baseUrl}/admin/staff`);
  }

  addDoctor(data: DoctorRegisterRequest): Observable<Staff> {
    return this.http.post<Staff>(`${this.baseUrl}/admin/doctors`, data);
  }

  addReceptionist(data: ReceptionistRegisterRequest): Observable<Staff> {
    return this.http.post<Staff>(`${this.baseUrl}/admin/receptionists`, data);
  }

  updateStaff(id: number, data: Partial<Staff>): Observable<Staff> {
    return this.http.put<Staff>(`${this.baseUrl}/admin/staff/${id}`, data);
  }

  toggleStaffActive(id: number, data: { isActive: boolean }): Observable<Staff> {
    return this.http.put<Staff>(`${this.baseUrl}/admin/staff/${id}/active`, data);
  }

  getReports(): Observable<ClinicReports> {
    return this.http.get<ClinicReports>(`${this.baseUrl}/admin/reports`);
  }

  // ── Dashboard ──
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }
}
