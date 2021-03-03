import { ToolbarComponent } from './../app-components/toolbar/toolbar.component';
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
    DriverPageRoutingModule
  ],
  declarations: [DriverPage, ToolbarComponent]
})
export class DriverPageModule {}
