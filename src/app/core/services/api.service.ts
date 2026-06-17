import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Auth ──
  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, { email, password });
  }

  getMe() {
    return this.http.get<any>(`${this.baseUrl}/auth/me`);
  }

  updateProfile(data: any) {
    return this.http.put<any>(`${this.baseUrl}/auth/profile`, data);
  }

  // ── Doctors ──
  getDoctors(params?: any) {
    return this.http.get<any>(`${this.baseUrl}/doctors`, { params });
  }

  getDoctorById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/doctors/${id}`);
  }

  getDoctorSlots(id: number, params?: any) {
    return this.http.get<any>(`${this.baseUrl}/doctors/${id}/slots`, { params });
  }

  getDoctorAvailability(id: number) {
    return this.http.get<any>(`${this.baseUrl}/doctors/${id}/availability`);
  }

  setDoctorAvailability(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/doctors/${id}/availability`, data);
  }

  // ── Services ──
  getServices() {
    return this.http.get<any>(`${this.baseUrl}/services`);
  }

  createService(data: any) {
    return this.http.post<any>(`${this.baseUrl}/services`, data);
  }

  updateService(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/services/${id}`, data);
  }

  deleteService(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/services/${id}`);
  }

  // ── Appointments (Front desk) ──
  getAppointments(params?: any) {
    return this.http.get<any>(`${this.baseUrl}/appointments`, { params });
  }

  getAppointmentById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/appointments/${id}`);
  }

  bookWalkIn(data: any) {
    return this.http.post<any>(`${this.baseUrl}/appointments/walk-in`, data);
  }

  rescheduleAppointment(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/appointments/${id}/reschedule`, data);
  }

  markArrived(id: number) {
    return this.http.put<any>(`${this.baseUrl}/appointments/${id}/arrived`, {});
  }

  markNoShow(id: number) {
    return this.http.put<any>(`${this.baseUrl}/appointments/${id}/no-show`, {});
  }

  markCashPaid(id: number) {
    return this.http.put<any>(`${this.baseUrl}/appointments/${id}/cash-paid`, {});
  }

  cancelAppointment(id: number) {
    return this.http.put<any>(`${this.baseUrl}/appointments/${id}/cancel`, {});
  }

  // ── Doctor Clinical ──
  getDoctorSchedule() {
    return this.http.get<any>(`${this.baseUrl}/doctor/schedule`);
  }

  completeAppointment(id: number) {
    return this.http.put<any>(`${this.baseUrl}/appointments/${id}/complete`, {});
  }

  recordVisit(appointmentId: number, data: any) {
    return this.http.post<any>(`${this.baseUrl}/appointments/${appointmentId}/visit`, data);
  }

  getPatientHistory(patientId: number) {
    return this.http.get<any>(`${this.baseUrl}/patients/${patientId}/history`);
  }

  // ── Patients ──
  getPatients(params?: any) {
    return this.http.get<any>(`${this.baseUrl}/patients`, { params });
  }

  createPatient(data: any) {
    return this.http.post<any>(`${this.baseUrl}/patients`, data);
  }

  // ── Admin ──
  getStaff() {
    return this.http.get<any>(`${this.baseUrl}/admin/staff`);
  }

  addDoctor(data: any) {
    return this.http.post<any>(`${this.baseUrl}/admin/doctors`, data);
  }

  addReceptionist(data: any) {
    return this.http.post<any>(`${this.baseUrl}/admin/receptionists`, data);
  }

  updateStaff(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/admin/staff/${id}`, data);
  }

  toggleStaffActive(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/admin/staff/${id}/active`, data);
  }

  getReports() {
    return this.http.get<any>(`${this.baseUrl}/admin/reports`);
  }

  // ── Dashboard ──
  getDashboardStats() {
    return this.http.get<any>(`${this.baseUrl}/dashboard/stats`);
  }
}
