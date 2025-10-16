import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-title',
  imports: [],
  template: `
    <div class="flex flex-col">
      <h2 class="text-2xl font-semibold text-gray-900">{{ title()}}</h2>
      <div class="text-sm text-gray-500">
        {{ subtitle() }}
      </div>
    </div>
  `,
  styles: ``
})
export class TableTitleComponent {

  title = input.required<string>();
  subtitle = input<string>();
  
}
