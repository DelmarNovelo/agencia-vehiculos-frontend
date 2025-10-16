import { Routes } from "@angular/router";
import { VehiculosLayoutComponent } from "./vehiculos-layout/vehiculos-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: VehiculosLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-vehiculos/lista-vehiculos.component')
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/nuevo-vehiculo/nuevo-vehiculo.component')
      },
      {
        path: 'detalles/:id',
        loadComponent: () => import('./pages/detalles-vehiculo/detalles-vehiculo.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]