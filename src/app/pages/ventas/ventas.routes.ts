import { Routes } from "@angular/router";
import { VentasLayoutComponent } from "./ventas-layout/ventas-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: VentasLayoutComponent,
    children: [
      {
        path: 'nueva',
        loadComponent: () => import('./pages/nueva-venta/nueva-venta.component')
      },
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-ventas/lista-ventas.component')
      },
      {
        path: 'detalles/:id',
        loadComponent: () => import('./pages/detalles-venta/detalles-venta.component')
      },
      {
        path: '',
        redirectTo: 'nueva',
        pathMatch: 'full'
      }
    ]
  }
]