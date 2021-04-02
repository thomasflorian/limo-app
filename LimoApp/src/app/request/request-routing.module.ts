import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestPage } from './request.page';

const routes: Routes = [
  {
    path: '',
    component: RequestPage
  },
  {
    path: 'ride',
    loadChildren: () => import('./ride/ride.module').then( m => m.RidePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestPageRoutingModule {}
