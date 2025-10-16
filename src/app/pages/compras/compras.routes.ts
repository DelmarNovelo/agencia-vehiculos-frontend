import { Routes } from "@angular/router";
import { ComprasLayoutComponent } from "./compras-layout/compras-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: ComprasLayoutComponent,
    children: [
      {
        path: 'nueva',
        loadComponent: () => import('./pages/nueva-compra/nueva-compra.component')
      },
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-compras/lista-compras.component')
      },
      {
        path: 'detalles/:id',
        loadComponent: () => import('./pages/detalles-compra/detalles-compra.component')
      },
      {
        path: '',
        redirectTo: 'nueva',
        pathMatch: 'full'
      }
    ]
  }
]