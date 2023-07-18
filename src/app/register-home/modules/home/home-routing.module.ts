import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleListComponent } from '../sale-list/sale-list.component';
import { RegisterComponent } from '../register/register.component';
import { AboutComponent } from '../../about/about.component';
// import { AuthGuard } from '../../../core/auth/auth-guard.';
import { HomeComponent } from './home.component';
import { DesignMenuComponent } from '../design-menu/design-menu.component';
import { AnalysisComponent } from '../analysis/analysis.component';
import { StatisticsComponent } from '../statistics/statistics.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'register' },
      { path: 'register', component: RegisterComponent },
      { path: 'sale-list', component: SaleListComponent },
      { path: 'design-menu', component: DesignMenuComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'statistics', component: StatisticsComponent },
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
