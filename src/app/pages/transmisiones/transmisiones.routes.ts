import { Routes } from "@angular/router";
import { TransmisionesLayoutComponent } from "./transmisiones-layout/transmisiones-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: TransmisionesLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-transmisiones/lista-transmisiones.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]