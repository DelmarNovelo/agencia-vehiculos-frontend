import { Routes } from "@angular/router";
import { MarcasLayoutComponent } from "./marcas-layout/marcas-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: MarcasLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-marcas/lista-marcas.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]