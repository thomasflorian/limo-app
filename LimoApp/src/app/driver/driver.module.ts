import { DriverHomeComponent } from './driver-components/driver-home/driver-home.component';
import { DriverMapComponent } from './driver-components/driver-map/driver-map.component';

import { LoginComponent } from './driver-components/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverPageRoutingModule } from './driver-routing.module';

import { DriverPage } from './driver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverPageRoutingModule],
  declarations: [DriverPage, LoginComponent, DriverMapComponent, DriverHomeComponent],
  exports: [DriverPage, LoginComponent, DriverMapComponent, DriverHomeComponent]
})
export class DriverPageModule { }
