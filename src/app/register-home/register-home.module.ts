import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegisterHomeComponent } from './register-home.component';
import { AuthGuard } from '../core/auth/auth-guard.';
import { AnalysisComponent } from './modules/analysis/analysis.component';
import { StatisticsComponent } from './modules/statistics/statistics.component';
import { SoldRecordsComponent } from './core/components/sold-records/sold-records.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    component: RegisterHomeComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/home/home-routing.module').then(
        (m) => m.HomeRoutingModule
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AnalysisComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class RegisterHomeModule {}
