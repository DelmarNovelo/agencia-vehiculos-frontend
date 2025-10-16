import { Routes } from "@angular/router";
import { DepartamentosLayoutComponent } from "./departamentos-layout/departamentos-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: DepartamentosLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-departamentos/lista-departamentos.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]