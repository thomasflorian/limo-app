import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { HomePage } from './home/home.page';
import { RequestComponent } from './home/home-components/request/request.component';
import { EtaComponent } from './home/home-components/eta/eta.component';
import { LoadingPage } from './loading/loading.page';
import { ToolbarComponent } from './app-components/toolbar/toolbar.component';
import { MapComponent } from './app-components/map/map.component';
@NgModule({
  declarations: [AppComponent, HomePage, RequestComponent, LoadingPage, ToolbarComponent, MapComponent, EtaComponent],
  entryComponents: [],
  imports: [BrowserModule, FormsModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
