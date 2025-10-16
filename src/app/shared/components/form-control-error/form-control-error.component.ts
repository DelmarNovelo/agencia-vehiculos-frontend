import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-control-error',
  imports: [
    NgIf,
  ],
  template: `
    @if (showError()) {
      <small class="text-red-500">{{ errorMessage() }}</small>
    }
  `,
  styles: ``
})
export class FormControlErrorComponent {

  showError = input<boolean>();
  errorMessage = input.required<string>();

}
