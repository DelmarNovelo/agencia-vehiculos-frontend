import { Routes } from "@angular/router";
import { LineasLayoutComponent } from "./lineas-layout/lineas-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: LineasLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-lineas/lista-lineas.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]