import { HttpRequest } from '@angular/common/http';
import { Appointment, PrescriptionItem } from '../models';
import { computeStaffOpenSlots, loadStaffDb, saveStaffDb } from './clinic-mock.store';
import {
  getStaffAuthUser,
  handleStaffAuthAndAdmin,
  throwHttpError,
} from './clinic-mock-auth.handlers';
import { handleStaffCatalogAndPatients } from './clinic-mock-catalog.handlers';

export function dispatchStaffMock(req: HttpRequest<unknown>, path: string): unknown {
  const db = loadStaffDb();
  const method = req.method.toUpperCase();
  const body = (req.body as Record<string, unknown>) || {};

  const authRes = handleStaffAuthAndAdmin(method, path, req, db);
  if (authRes !== undefined) return authRes;

  const catalogRes = handleStaffCatalogAndPatients(method, path, req, db);
  if (catalogRes !== undefined) return catalogRes;

  const slotMatch = path.match(/^\/doctors\/([^/]+)\/slots$/);
  if (method === 'GET' && slotMatch) {
    const date = req.params.get('date') || '';
    const serviceId = Number(req.params.get('serviceId') || 0);
    const srv = db.services.find((s) => s.id === serviceId);
    return {
      date,
      slots: computeStaffOpenSlots(db, slotMatch[1], date, srv?.durationMinutes || 30),
    };
  }

  if (method === 'GET' && path === '/appointments') {
    const date = req.params.get('date');
    return date ? db.appointments.filter((a) => a.date === date) : db.appointments;
  }

  if (method === 'GET' && path === '/doctor/schedule') {
    const user = getStaffAuthUser(req, db);
    return user?.role === 'doctor'
      ? db.appointments.filter((a) => String(a.doctorId) === user.id)
      : db.appointments;
  }

  if (method === 'POST' && path === '/appointments/walk-in') {
    const doc = db.doctors.find((d) => d.id === body['doctorId']);
    const srv = db.services.find((s) => s.id === Number(body['serviceId']));
    const date = String(body['date'] || '');
    const startTime = String(body['startTime'] || '');
    if (!doc || !srv || !computeStaffOpenSlots(db, doc.id, date).includes(startTime)) {
      throwHttpError(409, 'Selected time slot is unavailable.');
    }
    const newPat = body['newPatient'] as { name: string; phone: string } | undefined;
    let patient = body['patientId']
      ? db.patients.find((p) => p.id === Number(body['patientId']))
      : undefined;
    if (!patient && newPat) {
      const pid = db.counters.patientId++;
      patient = {
        id: pid,
        name: newPat.name,
        phone: newPat.phone,
        email: `walkin-${pid}@clinic.local`,
      };
      db.patients.push(patient);
    }
    const id = db.counters.appointmentId++;
    const ticketCode = `MDR-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
    const wCount =
      db.appointments.filter((a) => a.date === date && a.queueToken?.startsWith('W-')).length + 1;
    const appt: Appointment = {
      id,
      ticketCode,
      queueToken: `W-${String(wCount).padStart(2, '0')}`,
      roomNumber: doc.roomNumber || 'Suite 101',
      doctorId: doc.id,
      doctorName: doc.displayName,
      serviceId: srv.id,
      serviceName: srv.name,
      patientId: patient!.id,
      patientName: patient!.name,
      date,
      startTime,
      mode: 'InClinic',
      price: srv.price,
      status: 'Confirmed',
      payment: {
        id: id + 800,
        amount: srv.price,
        method: 'Cash',
        status: 'Pending',
        transactionRef: `CASH-${ticketCode}`,
        paidAt: null,
      },
    };
    db.appointments.push(appt);
    saveStaffDb(db);
    return appt;
  }

  const apptAction = path.match(
    /^\/appointments\/(\d+)\/(reschedule|arrived|no-show|cash-paid|complete|cancel|visit)$/,
  );
  if (apptAction) {
    const appt = db.appointments.find((a) => a.id === Number(apptAction[1]));
    if (!appt) throwHttpError(404, 'Appointment not found.');
    const action = apptAction[2];
    if (action === 'arrived') appt.status = 'Arrived';
    else if (action === 'no-show') appt.status = 'NoShow';
    else if (action === 'cancel') {
      appt.status = 'Cancelled';
      if (appt.payment?.status === 'Paid') appt.payment.status = 'Refunded';
    } else if (action === 'cash-paid' && appt.payment) {
      appt.payment.status = 'Paid';
      appt.payment.paidAt = new Date().toISOString();
      if (appt.status === 'PendingPayment') appt.status = 'Confirmed';
    } else if (action === 'complete') appt.status = 'Completed';
    else if (action === 'reschedule') {
      appt.date = String(body['date']);
      appt.startTime = String(body['startTime']);
    } else if (action === 'visit') {
      const rx = body['prescription'] as PrescriptionItem[] | string;
      const visit = {
        id: Date.now(),
        appointmentId: appt.id,
        patientId: appt.patientId,
        patientName: appt.patientName || '',
        doctorId: appt.doctorId,
        doctorName: appt.doctorName || '',
        date: appt.date,
        diagnosis: String(body['diagnosis'] || ''),
        notes: String(body['notes'] || ''),
        prescription: rx,
      };
      appt.visit = visit;
      appt.status = 'Completed';
      saveStaffDb(db);
      return visit;
    }
    saveStaffDb(db);
    return appt;
  }

  throwHttpError(404, `Mock endpoint not found: ${method} ${path}`);
}
