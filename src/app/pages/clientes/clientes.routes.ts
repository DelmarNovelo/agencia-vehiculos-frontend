import { Routes } from "@angular/router";
import { ClientesLayoutComponent } from "./clientes-layout/clientes-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: ClientesLayoutComponent,
    children: [
      {
        path: 'crear',
        loadComponent: () => import('./pages/crear-cliente/crear-cliente.component')
      },
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-clientes/lista-clientes.component')
      },
      {
        path: 'detalles/:id',
        loadComponent: () => import('./pages/detalles-cliente/detalles-cliente.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]