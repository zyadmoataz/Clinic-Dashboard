// ==========================================
// OWNER: Omar, Helda
// PURPOSE: Shared UI Component
// ==========================================
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full">
      <input
        type="text"
        (input)="onSearch($event)"
        class="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pr-4 pl-10 text-sm focus:border-teal-500 focus:outline-none"
        placeholder="Search by name or phone"
      />
    </div>
  `,
})
export class SearchInputComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
