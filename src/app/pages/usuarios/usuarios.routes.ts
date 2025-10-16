import { Routes } from "@angular/router";
import { UsuariosLayoutComponent } from "./usuarios-layout/usuarios-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: UsuariosLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-usuarios/lista-usuarios.component')
      },
      {
        path: 'crear',
        loadComponent: () => import('./pages/crear-usuario/crear-usuario.component')
      },
      {
        path: 'detalles/:id',
        loadComponent: () => import('./pages/detalles-usuario/detalles-usuario.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]