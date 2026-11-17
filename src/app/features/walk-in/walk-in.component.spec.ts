import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import {
  LucideAngularModule,
  Contact,
  Stethoscope,
  Calendar,
  DoorOpen,
  ChevronDown,
  X,
  CheckCircle2,
  Printer,
  AlertCircle,
} from 'lucide-angular';
import { of } from 'rxjs';
import { WalkInComponent } from './walk-in.component';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

describe('WalkInComponent', () => {
  const mockDoctors = [
    {
      id: 'doc-1',
      displayName: 'Dr. Sarah Mansour',
      specialization: 'Cardiology',
      services: [
        {
          id: 1,
          name: 'Cardiac Consultation & ECG',
          durationMinutes: 30,
          price: 450,
          doctorId: 'doc-1',
          doctorName: 'Dr. Sarah Mansour',
        },
        {
          id: 2,
          name: 'Echocardiography Follow-up',
          durationMinutes: 45,
          price: 650,
          doctorId: 'doc-1',
          doctorName: 'Dr. Sarah Mansour',
        },
      ],
    },
    {
      id: 'doc-5',
      displayName: 'Dr. Hana Zaki',
      specialization: 'Neurology',
      services: [
        {
          id: 9,
          name: 'Neurology & Migraine Consult',
          durationMinutes: 30,
          price: 520,
          doctorId: 'doc-5',
          doctorName: 'Dr. Hana Zaki',
        },
      ],
    },
  ];

  beforeEach(() => {
    const apiStub = {
      getDoctors: () => of({ items: mockDoctors, page: 1, pageSize: 50, total: 2 }),
      getServices: () => of([]),
      getPatients: () => of([]),
      getDoctorSlots: () => of([{ time: '09:00', isAvailable: true }]),
    };

    TestBed.configureTestingModule({
      imports: [WalkInComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        importProvidersFrom(
          LucideAngularModule.pick({
            Contact,
            Stethoscope,
            Calendar,
            DoorOpen,
            ChevronDown,
            X,
            CheckCircle2,
            Printer,
            AlertCircle,
          }),
        ),
        { provide: ApiService, useValue: apiStub },
        { provide: ToastService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    });
  });

  it('reactively populates service options when doctor changes and auto-picks single-service doctors', () => {
    const fixture = TestBed.createComponent(WalkInComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    expect(comp.servicesSelectOptions()).toEqual([]);

    comp.walkInForm.get('selectedDoctorId')?.setValue('doc-1');
    expect(comp.servicesSelectOptions().length).toBe(2);
    expect(comp.walkInForm.get('selectedServiceId')?.value).toBe('');

    comp.walkInForm.get('selectedDoctorId')?.setValue('doc-5');
    expect(comp.servicesSelectOptions().length).toBe(1);
    expect(comp.walkInForm.get('selectedServiceId')?.value).toBe('9');
    expect(comp.availableSlots().length).toBe(1);
  });
});
