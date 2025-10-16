import { Routes } from "@angular/router";
import { CombustiblesLayoutComponent } from "./combustibles-layout/combustibles-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: CombustiblesLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-combustibles/lista-combustibles.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]