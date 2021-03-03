import { ToolbarComponent } from './../app-components/toolbar/toolbar.component';
import { LoginComponent } from './driver-components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverPage } from './driver.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [ToolbarComponent, LoginComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverPageRoutingModule { }
