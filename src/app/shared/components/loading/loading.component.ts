import { Component } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  imports: [
    ProgressSpinner,
  ],
  template: ` 
    <div class="flex flex-col justify-center items-center gap-4 py-8">
      <h2 class="text-xl font-semibold text-gray-800">Cargando...</h2>
      <p-progress-spinner strokeWidth="3" fill="transparent" animationDuration=".5s" [style]="{ width: '100px', height: '100px' }" />
    </div>
  `,
  styles: ``
})
export class LoadingComponent {

}
