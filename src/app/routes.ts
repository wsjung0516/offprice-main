import { Routes } from '@angular/router';
import { HelpComponent } from './core/components/help/help.component';

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
  {
    path: 'help',
    component: HelpComponent,
  },
  { path: '**', redirectTo: 'error/404' },
];

