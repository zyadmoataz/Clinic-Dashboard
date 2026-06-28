import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-text text-2xl font-bold tracking-tight">My schedule</h2>
          <p class="text-muted text-sm">Your appointments for the day.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted text-sm font-medium">Date</span>
          <div
            class="bg-surface border-border flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
          >
            <span class="text-text font-medium">{{ today | date: 'MM/dd/yyyy' }}</span>
            <lucide-icon name="calendar" class="text-muted h-4 w-4"></lucide-icon>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center py-24 text-center">
        <div
          class="bg-surface-2 ring-border/50 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ring-1"
        >
          <lucide-icon name="calendar" class="text-muted h-8 w-8"></lucide-icon>
        </div>
        <h3 class="text-text text-lg font-bold">No appointments</h3>
        <p class="text-muted text-sm">You have nothing booked for this day.</p>
      </div>
    </div>
  `,
})
export class ScheduleComponent {
  today = new Date();
}
