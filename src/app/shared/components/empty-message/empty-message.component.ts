import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-message',
  imports: [
    NgClass,
  ],
  template: `
    <div class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <i class="text-6xl text-gray-300 mb-4" [ngClass]="icono()"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ mensaje() }}</h3>
        <p class="text-gray-600">{{ descripcion() }}</p>
      </div>
    </div>
  `,
  styles: ``
})
export class EmptyMessageComponent {

  mensaje = input.required<string>();
  descripcion = input<string>();
  icono = input.required<string>();
  
}
