import { HttpRequest } from '@angular/common/http';
import { StaffMockDb } from './clinic-seed';
import { saveStaffDb } from './clinic-mock.store';
import { throwHttpError } from './clinic-mock-auth.handlers';

export function handleStaffCatalogAndPatients(
  method: string,
  path: string,
  req: HttpRequest<unknown>,
  db: StaffMockDb,
): unknown | undefined {
  const body = (req.body as Record<string, unknown>) || {};

  if (method === 'GET' && path === '/doctors') {
    const items = db.doctors.map((d) => ({
      ...d,
      services: db.services.filter((s) => s.doctorId === d.id),
    }));
    return { items, page: 1, pageSize: 50, total: items.length };
  }

  const availMatch = path.match(/^\/doctors\/([^/]+)\/availability$/);
  if (availMatch) {
    const doc = db.doctors.find((d) => d.id === availMatch[1]);
    if (!doc) throwHttpError(404, 'Doctor not found.');
    if (method === 'GET') return doc.availability;
    if (method === 'PUT') {
      doc.availability = (
        (req.body as { dayOfWeek: string; startTime: string; endTime: string }[]) || []
      ).map((w) => ({
        id: db.counters.availId++,
        ...w,
      }));
      saveStaffDb(db);
      return null;
    }
  }

  const blockMatch = path.match(/^\/doctors\/([^/]+)\/blocked-dates(?:\/([^/]+))?$/);
  if (blockMatch) {
    const doc = db.doctors.find((d) => d.id === blockMatch[1]);
    if (!doc) throwHttpError(404, 'Doctor not found.');
    if (method === 'GET') return doc.blockedDates;
    if (method === 'POST') {
      const date = String(body['date'] || '');
      if (doc.blockedDates.some((b) => b.date === date)) throwHttpError(409, 'Already blocked.');
      const entry = { id: db.counters.blockId++, date };
      doc.blockedDates.push(entry);
      saveStaffDb(db);
      return entry;
    }
    if (method === 'DELETE' && blockMatch[2]) {
      doc.blockedDates = doc.blockedDates.filter((b) => b.date !== blockMatch[2]);
      saveStaffDb(db);
      return null;
    }
  }

  if (method === 'GET' && path === '/services') return db.services;
  if (method === 'POST' && path === '/services') {
    const doc = db.doctors.find((d) => d.id === body['doctorId']);
    const srv = {
      id: db.counters.serviceId++,
      name: String(body['name'] || ''),
      durationMinutes: Number(body['durationMinutes'] || 30),
      price: Number(body['price'] || 100),
      doctorId: String(body['doctorId'] || ''),
      doctorName: doc?.displayName || '',
    };
    db.services.push(srv);
    saveStaffDb(db);
    return srv;
  }

  const srvMatch = path.match(/^\/services\/(\d+)$/);
  if (srvMatch && (method === 'PUT' || method === 'DELETE')) {
    const idx = db.services.findIndex((s) => s.id === Number(srvMatch[1]));
    if (idx === -1) throwHttpError(404, 'Service not found.');
    if (method === 'DELETE') {
      db.services.splice(idx, 1);
      saveStaffDb(db);
      return null;
    }
    db.services[idx] = {
      ...db.services[idx],
      name: String(body['name']),
      durationMinutes: Number(body['durationMinutes']),
      price: Number(body['price']),
    };
    saveStaffDb(db);
    return db.services[idx];
  }

  if (method === 'GET' && path === '/patients') {
    const q = (req.params.get('search') || '').trim().toLowerCase();
    return q
      ? db.patients.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q))
      : db.patients;
  }
  if (method === 'POST' && path === '/patients') {
    const rawEmail = String(body['email'] || '')
      .trim()
      .toLowerCase();
    if (
      rawEmail &&
      (db.users.some((u) => u.email.toLowerCase() === rawEmail) ||
        db.patients.some((pt) => (pt.email || '').toLowerCase() === rawEmail))
    ) {
      throwHttpError(409, 'Email is already registered.');
    }
    const id = db.counters.patientId++;
    const p = {
      id,
      name: String(body['name']),
      phone: String(body['phone']),
      email: rawEmail || `walkin-${id}@clinic.local`,
    };
    db.patients.push(p);
    saveStaffDb(db);
    return p;
  }

  const histMatch = path.match(/^\/patients\/([^/]+)\/history$/);
  if (method === 'GET' && histMatch) {
    return db.appointments
      .filter((a) => String(a.patientId) === String(histMatch[1]) && a.visit)
      .map((a) => a.visit);
  }

  return undefined;
}
