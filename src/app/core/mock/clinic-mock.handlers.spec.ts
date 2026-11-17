import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { dispatchStaffMock } from './clinic-mock.handlers';

describe('Staff Mock Backend Handlers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows seeded staff login and blocks patient login on Staff Portal', () => {
    const adminRes = dispatchStaffMock(
      new HttpRequest('POST', '/api/auth/login', {
        email: 'admin@medoraclinics.com',
        password: 'Password123',
      }),
      '/auth/login',
    ) as { token: string; user: { role: string } };

    expect(adminRes.token).toContain('mock-jwt.');
    expect(adminRes.user.role).toBe('admin');

    expect(() =>
      dispatchStaffMock(
        new HttpRequest('POST', '/api/auth/login', {
          email: 'patient@medoraclinics.com',
          password: 'Password123',
        }),
        '/auth/login',
      ),
    ).toThrow(HttpErrorResponse);
  });

  it('filters patients out of /admin/staff and rejects duplicate patient emails when adding doctors', () => {
    const staff = dispatchStaffMock(new HttpRequest('GET', '/api/admin/staff'), '/admin/staff') as {
      role: string;
    }[];
    expect(staff.some((m) => m.role === 'patient')).toBe(false);

    expect(() =>
      dispatchStaffMock(
        new HttpRequest('POST', '/api/admin/doctors', {
          name: 'Dr. Duplicate',
          email: 'patient@medoraclinics.com',
          phone: '01000000000',
          specialization: 'Cardiology',
          password: 'Password123',
          availability: [],
        }),
        '/admin/doctors',
      ),
    ).toThrow(HttpErrorResponse);
  });

  it('returns service-scoped slots and prevents double booking walk-in slots with 409', () => {
    const doctors = dispatchStaffMock(new HttpRequest('GET', '/api/doctors'), '/doctors') as {
      items: { id: string; nextAvailableDate?: string }[];
    };
    expect(doctors.items.length).toBeGreaterThanOrEqual(6);

    const appts = dispatchStaffMock(
      new HttpRequest('GET', '/api/appointments'),
      '/appointments',
    ) as { date: string }[];
    const targetDate = appts[0].date;

    const reqWithService = new HttpRequest('GET', '/api/doctors/doc-5/slots').clone({
      params: new HttpRequest('GET', '/api/doctors/doc-5/slots').params
        .set('date', targetDate)
        .set('serviceId', '9'),
    });
    const slotRes = dispatchStaffMock(reqWithService, '/doctors/doc-5/slots') as {
      slots: string[];
    };
    expect(slotRes.slots.length).toBeGreaterThan(0);

    const chosen = slotRes.slots[0];
    const created = dispatchStaffMock(
      new HttpRequest('POST', '/api/appointments/walk-in', {
        doctorId: 'doc-5',
        serviceId: 9,
        date: targetDate,
        startTime: chosen,
        newPatient: { name: 'Walk-In Test', phone: '01099988877' },
      }),
      '/appointments/walk-in',
    ) as { ticketCode: string; queueToken: string };

    expect(created.ticketCode.startsWith('MDR-')).toBe(true);
    expect(created.queueToken.startsWith('W-')).toBe(true);

    expect(() =>
      dispatchStaffMock(
        new HttpRequest('POST', '/api/appointments/walk-in', {
          doctorId: 'doc-5',
          serviceId: 9,
          date: targetDate,
          startTime: chosen,
          newPatient: { name: 'Conflict Patient', phone: '01099988878' },
        }),
        '/appointments/walk-in',
      ),
    ).toThrow(HttpErrorResponse);
  });
});
