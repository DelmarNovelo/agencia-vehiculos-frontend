import { Routes } from "@angular/router";
import { TiposVehiculosLayoutComponent } from "./tipos-vehiculos-layout/tipos-vehiculos-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: TiposVehiculosLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-tipos-vehiculos/lista-tipos-vehiculos.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]