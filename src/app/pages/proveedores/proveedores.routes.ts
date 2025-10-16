import { Routes } from "@angular/router";
import { ProveedoresLayoutComponent } from "./proveedores-layout/proveedores-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: ProveedoresLayoutComponent,
    children: [
      {
        path: 'crear',
        loadComponent: () => import('./pages/crear-proveedor/crear-proveedor.component')
      },
      {
        path: 'detalles/:id',
        loadComponent: () => import('./pages/detalles-proveedor/detalles-proveedor.component')
      },
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-proveedores/lista-proveedores.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]