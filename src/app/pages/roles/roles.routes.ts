import { Routes } from "@angular/router";
import { RolesLayoutComponent } from "./roles-layout/roles-layout.component";

export const routes: Routes = [
  {
    path:'',
    component: RolesLayoutComponent,
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-roles/lista-roles.component')
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
]