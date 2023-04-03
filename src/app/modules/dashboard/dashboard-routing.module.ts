import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { TableListComponent } from './components/table-list/table-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'sale_list', pathMatch: 'full' },
      { path: 'sale_list', component: SaleListComponent },
      { path: 'table_list', component: TableListComponent },
      { path: '**', redirectTo: 'error/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
