import { Routes } from "@angular/router";
import { MetodosPagoLayoutComponent } from "./metodos-pago-layout/metodos-pago-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: MetodosPagoLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/metodos-pago-lista/metodos-pago-lista.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]