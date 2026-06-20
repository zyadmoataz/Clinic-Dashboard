// Core interfaces for staff dashboard
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'receptionist' | 'doctor' | 'patient';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Doctor {
  id: number;
  displayName: string;
  specialty: string;
  email: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  isActive: boolean;
}

export interface Slot {
  time: string;
  isAvailable: boolean;
}

export interface DoctorAvailability {
  id?: number;
  doctorId?: number;
  dayOfWeek: number; // 0 = Sunday, etc.
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "17:00"
}

export interface Service {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName?: string;
  serviceId: number;
  serviceName?: string;
  patientId: number;
  patientName?: string;
  date: string;
  timeSlot: string;
  status: 'PendingPayment' | 'Confirmed' | 'Arrived' | 'Completed' | 'NoShow' | 'Cancelled';
}

export interface WalkInBookingRequest {
  doctorId: number;
  serviceId: number;
  patientName: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
}

export interface RescheduleRequest {
  date: string;
  timeSlot: string;
}

export interface VisitRecordRequest {
  diagnosis: string;
  prescription: string;
  notes?: string;
}

export interface Visit {
  id: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
}

export interface Patient {
  id: number;
  displayName: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface Staff {
  id: number;
  displayName: string;
  email: string;
  role: 'admin' | 'receptionist' | 'doctor';
  isActive: boolean;
}

export interface DoctorRegisterRequest {
  displayName: string;
  email: string;
  specialty: string;
  yearsExperience: number;
}

export interface ReceptionistRegisterRequest {
  displayName: string;
  email: string;
}

export interface ClinicReports {
  totalRevenue: number;
  completedVisitsCount: number;
  newPatientsCount: number;
  revenueByService: { serviceName: string; revenue: number }[];
}

export interface DashboardStats {
  todayAppointmentsCount: number;
  pendingVisitsCount: number;
  activeDoctorsCount: number;
  totalPatientsCount: number;
}
