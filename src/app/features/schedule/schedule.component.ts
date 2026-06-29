import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslatePipe],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  today = new Date();
}
