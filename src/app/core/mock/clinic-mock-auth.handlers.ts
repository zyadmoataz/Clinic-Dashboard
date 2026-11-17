import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Staff } from '../models';
import { MockUserEntry, StaffMockDb } from './clinic-seed';
import {
  computeClinicReports,
  computeDashboardStats,
  resetStaffDb,
  saveStaffDb,
} from './clinic-mock.store';

function toPublicStaff(u: MockUserEntry): Staff {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role as Staff['role'],
    isActive: u.isActive,
    specialization: u.specialization,
  };
}

export function getStaffAuthUser(req: HttpRequest<unknown>, db: StaffMockDb) {
  const auth = req.headers.get('Authorization') || '';
  if (auth.startsWith('Bearer mock-jwt.')) {
    try {
      const id = atob(auth.slice(16));
      const user = db.users.find((u) => u.id === id);
      if (user && user.isActive) return user;
    } catch {
      return null;
    }
  }
  const rawUser = localStorage.getItem('cc_user');
  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser) as { id?: string };
      return db.users.find((u) => u.id === parsed.id && u.isActive) ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

export function throwHttpError(status: number, message: string): never {
  throw new HttpErrorResponse({ status, statusText: message, error: { message } });
}

export function handleStaffAuthAndAdmin(
  method: string,
  path: string,
  req: HttpRequest<unknown>,
  db: StaffMockDb,
): unknown | undefined {
  const body = (req.body as Record<string, unknown>) || {};

  if (method === 'POST' && path === '/demo/reset') {
    resetStaffDb();
    return { reset: true };
  }

  if (method === 'POST' && path === '/auth/login') {
    const email = String(body['email'] || '')
      .trim()
      .toLowerCase();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email && u.password === body['password'],
    );
    if (!user || !user.isActive) throwHttpError(401, 'Invalid email or password.');
    if (user.role === 'patient')
      throwHttpError(403, 'Patient accounts cannot access Staff Portal.');
    return {
      token: `mock-jwt.${btoa(user.id)}`,
      user: { id: user.id, email: user.email, displayName: user.name, role: user.role },
    };
  }

  if (method === 'GET' && path === '/auth/me') {
    const user = getStaffAuthUser(req, db);
    if (!user) throwHttpError(401, 'Unauthorized');
    return { id: user.id, email: user.email, displayName: user.name, role: user.role };
  }

  if (method === 'PUT' && path === '/auth/profile') {
    const user = getStaffAuthUser(req, db);
    if (!user) throwHttpError(401, 'Unauthorized');
    if (body['displayName']) user.name = String(body['displayName']).trim();
    saveStaffDb(db);
    return { id: user.id, email: user.email, displayName: user.name, role: user.role };
  }

  if (method === 'GET' && path === '/dashboard/stats') return computeDashboardStats(db);
  if (method === 'GET' && path === '/admin/reports') return computeClinicReports(db);
  if (method === 'GET' && path === '/admin/staff') {
    return db.users.filter((u) => u.role !== 'patient').map(toPublicStaff);
  }

  if (method === 'POST' && (path === '/admin/doctors' || path === '/admin/receptionists')) {
    const email = String(body['email'] || '')
      .trim()
      .toLowerCase();
    const emailTaken =
      db.users.some((u) => u.email.toLowerCase() === email) ||
      db.patients.some((p) => (p.email || '').toLowerCase() === email);
    if (emailTaken) throwHttpError(409, 'Email already exists.');
    const isDoc = path.endsWith('/doctors');
    const id = `${isDoc ? 'doc' : 'usr-recep'}-${Date.now()}`;
    const entry: MockUserEntry = {
      id,
      name: String(body['name'] || ''),
      email,
      phone: String(body['phone'] || ''),
      role: isDoc ? 'doctor' : 'receptionist',
      specialization: isDoc ? String(body['specialization'] || '') : undefined,
      isActive: true,
      password: String(body['password'] || 'Password123'),
    };
    db.users.push(entry);
    if (isDoc) {
      db.doctors.push({
        id,
        displayName: entry.name,
        specialization: entry.specialization || 'General Practice',
        photoUrl: (body['photoUrl'] as string) || null,
        bio: (body['bio'] as string) || null,
        services: [],
        rating: 5,
        reviewCount: 0,
        yearsExperience: 3,
        roomNumber: `Suite ${110 + db.doctors.length}`,
        availability: (
          (body['availability'] as { dayOfWeek: string; startTime: string; endTime: string }[]) ||
          []
        ).map((w) => ({
          id: db.counters.availId++,
          ...w,
        })),
        blockedDates: [],
      });
    }
    saveStaffDb(db);
    return toPublicStaff(entry);
  }

  const toggleMatch = path.match(/^\/admin\/staff\/([^/]+)\/active$/);
  if (method === 'PUT' && toggleMatch) {
    const target = db.users.find((u) => u.id === toggleMatch[1]);
    if (!target) throwHttpError(404, 'Staff member not found.');
    target.isActive = Boolean(body['isActive']);
    saveStaffDb(db);
    return toPublicStaff(target);
  }

  return undefined;
}
