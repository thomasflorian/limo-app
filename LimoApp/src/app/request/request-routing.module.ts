import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestPage } from './request.page';

// Child routes of request page.
const routes: Routes = [
  {
    path: '',
    component: RequestPage
  },
  {
    // route to ride page
    path: 'ride',
    loadChildren: () => import('./ride/ride.module').then( m => m.RidePageModule)
  },
  {
    // route to welcome page
    path: 'welcome',
    loadChildren: () => import('../welcome/welcome.module').then( m => m.WelcomePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestPageRoutingModule {}
