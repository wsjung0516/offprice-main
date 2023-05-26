import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleListComponent } from '../sale-list/sale-list.component';
import { RegisterComponent } from '../register/register.component';
import { AboutComponent } from '../about/about.component';
import { AuthGuard } from '../../core/auth/auth-guard.';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'register' },
      { path: 'sale-list', component: SaleListComponent },
      { path: 'register', component: RegisterComponent },
      // { path: 'sale-list', component: SaleListComponent, canActivate: [AuthGuard]},
      // { path: 'register', component: RegisterComponent, canActivate: [AuthGuard]},
      { path: 'about', component: AboutComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [],
  exports: [],
})
export class HomeRoutingModule {}
