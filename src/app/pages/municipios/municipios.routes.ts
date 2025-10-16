import { Routes } from "@angular/router";
import { MunicipiosLayoutComponent } from "./municipios-layout/municipios-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: MunicipiosLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-municipios/lista-municipios.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]