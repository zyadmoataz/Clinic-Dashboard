import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Appointment } from '../../core/models';
import { ButtonComponent, ModalComponent } from '../../shared/components';

@Component({
  selector: 'app-walk-in-ticket-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ModalComponent, ButtonComponent],
  template: `
    @if (ticket()) {
      <app-modal title="Walk-In Ticket Issued" (closed)="closed.emit()">
        <div class="space-y-4">
          <div class="bg-primary text-on-primary flex items-center justify-between rounded-2xl p-4">
            <div>
              <p class="text-[11px] font-semibold uppercase opacity-80">Medora Clinics Ticket</p>
              <p class="text-lg font-extrabold tabular-nums">
                {{ ticket()!.ticketCode || 'MDR-' + ticket()!.id }}
              </p>
            </div>
            <div class="rounded-xl bg-white/15 px-3.5 py-1.5 text-center">
              <p class="text-[10px] uppercase opacity-80">Queue</p>
              <p class="text-xl font-extrabold tabular-nums">
                #{{ ticket()!.queueToken || 'W-01' }}
              </p>
            </div>
          </div>

          <div class="border-border divide-border divide-y rounded-xl border px-4 text-sm">
            <div class="flex justify-between py-2.5">
              <span class="text-muted">Patient</span>
              <span class="font-bold">{{ ticket()!.patientName }}</span>
            </div>
            <div class="flex justify-between py-2.5">
              <span class="text-muted">Doctor</span>
              <span class="font-bold">{{ ticket()!.doctorName }}</span>
            </div>
            <div class="flex justify-between py-2.5">
              <span class="text-muted">Service &amp; Room</span>
              <span class="font-semibold"
                >{{ ticket()!.serviceName }} · {{ ticket()!.roomNumber || 'Suite 101' }}</span
              >
            </div>
            <div class="flex justify-between py-2.5">
              <span class="text-muted">Date &amp; Time</span>
              <span class="font-semibold tabular-nums"
                >{{ ticket()!.date }} · {{ ticket()!.startTime }}</span
              >
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <app-button variant="secondary" (clicked)="printTicket()">
              <lucide-icon name="printer" class="me-1.5 h-4 w-4"></lucide-icon>
              Print Ticket
            </app-button>
            <app-button (clicked)="closed.emit()">Done</app-button>
          </div>
        </div>
      </app-modal>
    }
  `,
})
export class WalkInTicketModalComponent {
  ticket = input<Appointment | null>(null);
  closed = output<void>();

  printTicket() {
    window.print();
  }
}
