import { Routes } from "@angular/router";
import { TiposContactoLayoutComponent } from "./tipos-contacto-layout/tipos-contacto-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: TiposContactoLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/tipos-contacto-lista/tipos-contacto-lista.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]