import { ClinicReports, DashboardStats } from '../models';
import { createStaffMockSeed, isoDateOffset, StaffMockDb } from './clinic-seed';

const KEY = 'medora_staff_mock_db_v4';
const LEGACY_KEYS = [
  'clarity_staff_mock_db_v1',
  'clarity_staff_mock_db_v2',
  'medora_staff_mock_db_v3',
];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function loadStaffDb(): StaffMockDb {
  for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const seed = createStaffMockSeed();
    saveStaffDb(seed);
    return seed;
  }
  try {
    return JSON.parse(raw) as StaffMockDb;
  } catch {
    const seed = createStaffMockSeed();
    saveStaffDb(seed);
    return seed;
  }
}

export function saveStaffDb(db: StaffMockDb): void {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetStaffDb(): StaffMockDb {
  const seed = createStaffMockSeed();
  saveStaffDb(seed);
  return seed;
}

export function computeStaffOpenSlots(
  db: StaffMockDb,
  doctorId: string,
  date: string,
  stepMinutes = 30,
): string[] {
  const doc = db.doctors.find((d) => String(d.id) === String(doctorId));
  if (!doc || !date || date < isoDateOffset(0)) return [];
  if (doc.blockedDates.some((b) => b.date === date)) return [];

  const [y, m, d] = date.split('-').map(Number);
  const dayName = DAYS[new Date(y, m - 1, d).getDay()];
  const windows = doc.availability.filter((w) => w.dayOfWeek === dayName);
  if (!windows.length) return [];

  const taken = new Set(
    db.appointments
      .filter(
        (a) =>
          String(a.doctorId) === String(doctorId) && a.date === date && a.status !== 'Cancelled',
      )
      .map((a) => a.startTime),
  );

  const slots = new Set<string>();
  for (const w of windows) {
    const [sh, sm] = w.startTime.split(':').map(Number);
    const [eh, em] = w.endTime.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    for (let t = start; t + stepMinutes <= end; t += 30) {
      const label = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      if (!taken.has(label)) slots.add(label);
    }
  }
  return Array.from(slots).sort();
}

export function computeDashboardStats(db: StaffMockDb): DashboardStats {
  const today = isoDateOffset(0);
  const todays = db.appointments.filter((a) => a.date === today);
  return {
    todaysAppointments: todays.length,
    confirmed: todays.filter((a) => a.status === 'Confirmed').length,
    arrived: todays.filter((a) => a.status === 'Arrived').length,
    completed: todays.filter((a) => a.status === 'Completed').length,
    noShow: todays.filter((a) => a.status === 'NoShow').length,
    todaysRevenue: todays
      .filter((a) => a.payment?.status === 'Paid')
      .reduce((sum, a) => sum + (a.payment?.amount || a.price || 0), 0),
    activeDoctors: db.users.filter((u) => u.role === 'doctor' && u.isActive).length,
    totalPatients: db.patients.length,
  };
}

export function computeClinicReports(db: StaffMockDb): ClinicReports {
  const paid = db.appointments.filter((a) => a.payment?.status === 'Paid');
  const map = new Map<string, number>();
  for (const a of paid) {
    const label = a.serviceName || 'Consultation';
    map.set(label, (map.get(label) || 0) + (a.payment?.amount || a.price || 0));
  }
  const total = db.appointments.length || 1;
  return {
    totalRevenue: paid.reduce((sum, a) => sum + (a.payment?.amount || a.price || 0), 0),
    completedVisitsCount: db.appointments.filter((a) => a.status === 'Completed').length,
    newPatientsCount: db.patients.length,
    revenueByService: Array.from(map.entries()).map(([serviceName, revenue]) => ({
      serviceName,
      revenue,
    })),
    statusBreakdown: {
      confirmed: Math.round(
        (db.appointments.filter((a) => ['Confirmed', 'Arrived'].includes(a.status)).length /
          total) *
          100,
      ),
      completed: Math.round(
        (db.appointments.filter((a) => a.status === 'Completed').length / total) * 100,
      ),
      awaitingPayment: Math.round(
        (db.appointments.filter((a) => a.status === 'PendingPayment').length / total) * 100,
      ),
      noShowOrCancelled: Math.round(
        (db.appointments.filter((a) => ['NoShow', 'Cancelled'].includes(a.status)).length / total) *
          100,
      ),
    },
  };
}
