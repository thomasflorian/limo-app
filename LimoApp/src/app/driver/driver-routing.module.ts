import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverPage } from './driver.page';

// All the child routes of DriverPage
const routes: Routes = [
  {
    path: '',
    component: DriverPage
  },
  {
    // Route to task page
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then( m => m.TasksPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverPageRoutingModule {}
