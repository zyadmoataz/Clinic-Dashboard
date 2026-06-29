import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  today = new Date();
}
