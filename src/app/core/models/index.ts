export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'receptionist' | 'doctor' | 'patient';
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface PrescriptionItem {
  drug: string;
  dosage: string;
  duration: string;
}

export interface PaginatedDoctorsResponse {
  items: Doctor[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Doctor {
  id: string;
  displayName: string;
  specialization: string;
  photoUrl: string | null;
  bio: string | null;
  services: Service[];
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  roomNumber?: string;
}

export interface getDoctorsParams {
  search?: string;
  specialization?: string;
  serviceId?: number;
  availableOn?: string;
  mode?: string;
  page?: number;
  pageSize?: number;
}

export interface Slot {
  time: string;
  isAvailable: boolean;
}

export interface DoctorAvailability {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Service {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  doctorId: string;
  doctorName: string;
}

export interface BlockedDate {
  id: number;
  date: string;
}

export interface Appointment {
  id: number;
  ticketCode?: string;
  queueToken?: string;
  roomNumber?: string;
  doctorId: string | number;
  doctorName?: string;
  serviceId: number;
  serviceName?: string;
  patientId: number;
  patientName?: string;
  date: string;
  startTime: string;
  endTime?: string;
  mode?: string;
  notes?: string;
  price?: number;
  status: 'PendingPayment' | 'Confirmed' | 'Arrived' | 'Completed' | 'NoShow' | 'Cancelled';
  payment?: {
    id: number;
    amount: number;
    method: string;
    status: string;
    transactionRef: string;
    paidAt: string | null;
  };
  visit?: Visit | null;
}

export interface WalkInBookingRequest {
  doctorId: string;
  serviceId: number;
  newPatient?: { name: string; phone: string };
  patientId?: number;
  date: string;
  startTime: string;
}

export interface RescheduleRequest {
  date: string;
  startTime: string;
}

export interface VisitRecordRequest {
  diagnosis: string;
  prescription: PrescriptionItem[] | string;
  notes?: string;
}

export interface Visit {
  id: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorId: string | number;
  doctorName: string;
  date: string;
  diagnosis: string;
  prescription: PrescriptionItem[] | string;
  notes?: string;
}

export interface Patient {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'receptionist' | 'doctor';
  isActive: boolean;
  specialization?: string;
}

export interface DoctorRegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  photoUrl?: string;
  bio?: string;
  availability?: Omit<DoctorAvailability, 'id'>[];
}

export interface ReceptionistRegisterRequest {
  name: string;
  email: string;
  phone: number | string;
  password: string;
}

export interface ClinicReports {
  totalRevenue: number;
  completedVisitsCount: number;
  newPatientsCount: number;
  revenueByService: { serviceName: string; revenue: number }[];
  statusBreakdown?: {
    confirmed: number;
    completed: number;
    awaitingPayment: number;
    noShowOrCancelled: number;
  };
}

export interface DashboardStats {
  todaysAppointments: number;
  confirmed: number;
  arrived: number;
  completed: number;
  noShow: number;
  todaysRevenue: number;
  activeDoctors?: number;
  totalPatients?: number;
}
