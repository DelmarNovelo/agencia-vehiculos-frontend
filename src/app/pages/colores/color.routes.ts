import { Routes } from "@angular/router";
import { ColoresLayoutComponent } from "./colores-layout/colores-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: ColoresLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-colores/lista-colores.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]