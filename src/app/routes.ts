import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'login',
    loadChildren: () => import('src/app/core/auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register-home',
    loadChildren: () => import('./register-home/register-home.module').then((m) => m.RegisterHomeModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

