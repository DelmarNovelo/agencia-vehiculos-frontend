import { Component, input } from '@angular/core';

@Component({
  selector: 'app-property',
  imports: [],
  template: `
    <div class="flex justify-between">
      <span class="text-gray-600">{{ label() }}</span>
      <span class="font-medium">{{ value() }}</span>
    </div>
  `,
  styles: ``
})
export class PropertyComponent {

  label = input.required();
  value = input.required();
}
