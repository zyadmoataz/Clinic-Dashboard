import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Appointment } from '../../core/models';
import { ButtonComponent, InputComponent, ModalComponent } from '../../shared/components';
import { LoadingComponent } from '../../shared/components/loading.component';
import { toLocalIsoDate } from '../../core/utils/format.util';

@Component({
  selector: 'app-reschedule-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ModalComponent,
    InputComponent,
    ButtonComponent,
    LoadingComponent,
  ],
  template: `
    @if (appointment()) {
      <app-modal [title]="'calendar.reschedule_title' | translate" (closed)="closed.emit()">
        <div class="flex flex-col gap-4">
          <p class="text-muted text-sm">
            {{ appointment()!.ticketCode }} · {{ appointment()!.patientName }} ({{
              appointment()!.doctorName
            }})
          </p>
          <app-input
            type="date"
            [ngModel]="rescheduleDate()"
            (ngModelChange)="onDateChange($event)"
            [label]="'walk_in.date' | translate"
          />
          <div>
            <span class="text-muted mb-2 block text-sm font-medium">{{
              'walk_in.time_slot' | translate
            }}</span>
            @if (loadingSlots()) {
              <app-loading />
            } @else if (slots().length === 0) {
              <p class="text-muted text-sm">{{ 'walk_in.no_slots' | translate }}</p>
            } @else {
              <div class="flex flex-wrap gap-2">
                @for (slot of slots(); track slot) {
                  <button
                    type="button"
                    (click)="selectedSlot.set(slot)"
                    class="cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    [class.bg-primary]="selectedSlot() === slot"
                    [class.text-white]="selectedSlot() === slot"
                    [class.border-primary]="selectedSlot() === slot"
                    [class.border-border]="selectedSlot() !== slot"
                    [class.text-text]="selectedSlot() !== slot"
                  >
                    {{ slot }}
                  </button>
                }
              </div>
            }
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <app-button variant="secondary" (clicked)="closed.emit()" [disabled]="saving()">
              {{ 'common.cancel' | translate }}
            </app-button>
            <app-button (clicked)="submit()" [disabled]="!selectedSlot() || saving()">
              {{ 'common.confirm' | translate }}
            </app-button>
          </div>
        </div>
      </app-modal>
    }
  `,
})
export class RescheduleModalComponent {
  appointment = input<Appointment | null>(null);
  closed = output<void>();
  rescheduled = output<void>();

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  rescheduleDate = signal<string>(toLocalIsoDate());
  slots = signal<string[]>([]);
  selectedSlot = signal<string>('');
  loadingSlots = signal<boolean>(false);
  saving = signal<boolean>(false);

  constructor() {
    effect(() => {
      const appt = this.appointment();
      if (appt) {
        const d = appt.date.split('T')[0];
        this.rescheduleDate.set(d);
        this.selectedSlot.set('');
        this.loadSlots(String(appt.doctorId), appt.serviceId?.toString());
      }
    });
  }

  onDateChange(date: string) {
    const appt = this.appointment();
    this.rescheduleDate.set(date);
    this.selectedSlot.set('');
    if (appt) this.loadSlots(String(appt.doctorId), appt.serviceId?.toString());
  }

  private loadSlots(doctorId: string, serviceId?: string) {
    this.loadingSlots.set(true);
    this.api.getDoctorSlots(doctorId, { date: this.rescheduleDate(), serviceId }).subscribe({
      next: (res) => {
        this.slots.set(res.filter((s) => s.isAvailable).map((s) => s.time));
        this.loadingSlots.set(false);
      },
      error: () => {
        this.slots.set([]);
        this.loadingSlots.set(false);
      },
    });
  }

  submit() {
    const appt = this.appointment();
    if (!appt || !this.selectedSlot() || this.saving()) return;
    this.saving.set(true);
    this.api
      .rescheduleAppointment(appt.id, {
        date: this.rescheduleDate(),
        startTime: this.selectedSlot(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toast.success(this.translate.instant('calendar.action_success'));
          this.rescheduled.emit();
        },
        error: () => {
          this.saving.set(false);
          this.toast.error(this.translate.instant('calendar.action_failed'));
        },
      });
  }
}
