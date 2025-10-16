import { Routes } from "@angular/router";
import { ModelosLayoutComponent } from "./modelos-layout/modelos-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: ModelosLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-modelos/lista-modelos.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
];