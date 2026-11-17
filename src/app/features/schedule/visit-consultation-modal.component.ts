import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Appointment, PrescriptionItem, Visit } from '../../core/models';
import { ButtonComponent, ModalComponent } from '../../shared/components';

@Component({
  selector: 'app-visit-consultation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent, ButtonComponent],
  template: `
    @if (appointment()) {
      <app-modal [title]="modalTitle" (closed)="closed.emit()">
        <div class="space-y-4 text-sm">
          <div class="bg-surface-2 border-border rounded-xl border p-3.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[var(--color-text)]">{{
                appointment()!.patientName
              }}</span>
              <span
                class="bg-primary-soft text-primary rounded-full px-2.5 py-0.5 text-xs font-bold"
              >
                {{ appointment()!.ticketCode || 'MDR-' + appointment()!.id }}
              </span>
            </div>
            <p class="mt-0.5 text-xs text-[var(--color-muted)]">
              {{ appointment()!.serviceName }} · {{ appointment()!.date }}
              {{ appointment()!.startTime }}
            </p>
            @if (appointment()!.notes) {
              <p class="mt-2 text-xs text-[var(--color-text)]">
                <strong>Patient note:</strong> {{ appointment()!.notes }}
              </p>
            }
          </div>

          @if (history().length > 0) {
            <div>
              <p class="mb-1.5 text-xs font-bold text-[var(--color-muted)] uppercase">
                Prior Visit History
              </p>
              <div class="max-h-28 space-y-1.5 overflow-y-auto">
                @for (h of history(); track h.id) {
                  <div class="border-border rounded-lg border px-3 py-2 text-xs">
                    <span class="font-semibold">{{ h.date }}:</span> {{ h.diagnosis }}
                  </div>
                }
              </div>
            </div>
          }

          <div>
            <label
              for="visit-diagnosis"
              class="mb-1 block text-xs font-bold text-[var(--color-text)]"
            >
              Diagnosis *
            </label>
            <input
              id="visit-diagnosis"
              type="text"
              [readOnly]="isReadOnly"
              [ngModel]="diagnosis()"
              (ngModelChange)="diagnosis.set($event)"
              placeholder="e.g. Mild essential hypertension"
              class="border-border bg-surface text-text w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label for="visit-notes" class="mb-1 block text-xs font-bold text-[var(--color-text)]">
              Clinical Notes
            </label>
            <textarea
              id="visit-notes"
              rows="2"
              [readOnly]="isReadOnly"
              [ngModel]="notes()"
              (ngModelChange)="notes.set($event)"
              placeholder="Care instructions & follow-up advice..."
              class="border-border bg-surface text-text w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
            ></textarea>
          </div>

          <div>
            <div class="mb-2 flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--color-text)]">E-Prescription</span>
              @if (!isReadOnly) {
                <button
                  type="button"
                  (click)="addMedication()"
                  class="text-primary inline-flex cursor-pointer items-center gap-1 text-xs font-bold"
                >
                  <lucide-icon name="plus" class="h-3.5 w-3.5"></lucide-icon>
                  Add Medication
                </button>
              }
            </div>
            <div class="space-y-2">
              @for (item of medications(); track $index) {
                <div
                  class="grid grid-cols-1 gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 p-2.5 sm:grid-cols-12"
                >
                  <input
                    type="text"
                    [readOnly]="isReadOnly"
                    [(ngModel)]="item.drug"
                    placeholder="Medication"
                    aria-label="Medication name"
                    class="border-border bg-surface rounded-lg border px-2.5 py-2 text-xs sm:col-span-5"
                  />
                  <input
                    type="text"
                    [readOnly]="isReadOnly"
                    [(ngModel)]="item.dosage"
                    placeholder="Dosage"
                    aria-label="Medication dosage"
                    class="border-border bg-surface rounded-lg border px-2.5 py-2 text-xs sm:col-span-5"
                  />
                  <input
                    type="text"
                    [readOnly]="isReadOnly"
                    [(ngModel)]="item.duration"
                    placeholder="Days"
                    aria-label="Medication duration"
                    class="border-border bg-surface rounded-lg border px-2.5 py-2 text-xs sm:col-span-2"
                  />
                </div>
              }
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <app-button variant="secondary" (clicked)="closed.emit()">Close</app-button>
            @if (!isReadOnly) {
              <app-button [disabled]="!diagnosis().trim() || saving()" (clicked)="submitVisit()">
                {{ saving() ? 'Saving...' : 'Complete Visit & Issue Rx' }}
              </app-button>
            }
          </div>
        </div>
      </app-modal>
    }
  `,
})
export class VisitConsultationModalComponent {
  appointment = input<Appointment | null>(null);
  closed = output<void>();
  completed = output<void>();

  private api = inject(ApiService);
  private toast = inject(ToastService);

  diagnosis = signal('');
  notes = signal('');
  medications = signal<PrescriptionItem[]>([{ drug: '', dosage: '', duration: '' }]);
  history = signal<Visit[]>([]);
  saving = signal(false);

  get isReadOnly(): boolean {
    return this.appointment()?.status === 'Completed' && !!this.appointment()?.visit;
  }

  get modalTitle(): string {
    return this.isReadOnly ? 'Completed Visit Summary' : 'Consultation & E-Prescription';
  }

  constructor() {
    effect(() => {
      const appt = this.appointment();
      if (!appt) return;
      if (appt.visit) {
        this.diagnosis.set(appt.visit.diagnosis || '');
        this.notes.set(appt.visit.notes || '');
        this.medications.set(
          Array.isArray(appt.visit.prescription)
            ? appt.visit.prescription.map((p) => ({ ...p }))
            : [
                {
                  drug: String(appt.visit.prescription || ''),
                  dosage: 'As directed',
                  duration: '7 days',
                },
              ],
        );
      } else {
        this.diagnosis.set('');
        this.notes.set('');
        this.medications.set([{ drug: '', dosage: '', duration: '' }]);
      }
      if (appt.patientId) {
        this.api.getPatientHistory(appt.patientId).subscribe({
          next: (v) => this.history.set(v || []),
          error: () => this.history.set([]),
        });
      }
    });
  }

  addMedication() {
    this.medications.update((list) => [...list, { drug: '', dosage: '', duration: '' }]);
  }

  submitVisit() {
    const appt = this.appointment();
    if (!appt || !this.diagnosis().trim() || this.saving()) return;
    const validMeds = this.medications().filter((m) => m.drug.trim());
    this.saving.set(true);
    this.api
      .recordVisit(appt.id, {
        diagnosis: this.diagnosis().trim(),
        notes: this.notes().trim(),
        prescription: validMeds,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toast.success('Consultation completed and E-Prescription published.');
          this.completed.emit();
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Could not save consultation.');
        },
      });
  }
}
