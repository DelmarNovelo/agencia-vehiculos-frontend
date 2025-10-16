import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'panel',
    loadChildren: () => import('./pages/main-layout/main-layout.routes').then(m => m.routes)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full'
  }
];
