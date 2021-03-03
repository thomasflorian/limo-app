import { DriverPage } from './driver/driver.page';
import { RequestComponent } from './home/home-components/request/request.component';
import { EtaComponent } from './home/home-components/eta/eta.component';
import { LoadingPage } from './loading/loading.page';
import { HomePage } from './home/home.page';
import { NgModule, Component } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {DriverPageModule} from './driver/driver.module'

const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: 'full'},
  { path: 'home', component: HomePage, children: [
    {path: '', redirectTo: 'request', pathMatch: 'full'},
    {path: 'request', component: RequestComponent},
    {path: 'eta', component: EtaComponent}
  ]},
  { path: 'loading', 
    component: LoadingPage 
  },
  {
    path: 'driver',
    component: DriverPage,
    loadChildren: () => import('./driver/driver.module').then( m => m.DriverPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
