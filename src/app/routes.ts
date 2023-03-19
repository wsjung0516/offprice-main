import { Routes } from '@angular/router';
import { AboutComponent } from './core/components/about/about.component';
import { AuthGuard } from './auth/keycloak/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  // },
  { path: '**', redirectTo: 'error/404' },
];

