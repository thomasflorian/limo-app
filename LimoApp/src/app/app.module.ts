
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Geolocation } from '@ionic-native/geolocation/ngx'
import { IonicStorageModule } from '@ionic/storage-angular';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule, AngularFireAuthModule, AngularFireFunctionsModule],
  providers: [Geolocation, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: REGION, useValue: "us-central1" }],
  bootstrap: [AppComponent],
})
export class AppModule { }
