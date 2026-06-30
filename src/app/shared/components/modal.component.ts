import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template: `
    <!-- <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 class="mb-4 text-xl font-bold">Modal Title</h2>
        <p>Modal content goes here.</p>
        <div class="mt-6 flex justify-end gap-2">
          <button class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>-->

    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-surface border-border w-full max-w-md rounded-xl border p-6 shadow-xl">
        <ng-content />
      </div>
    </div>
  `,
})
export class ModalComponent {}
