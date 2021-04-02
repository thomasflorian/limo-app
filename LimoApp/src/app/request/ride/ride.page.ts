import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMaps } from '@ionic-native/google-maps';
import { IonRouterOutlet, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  @ViewChild('map', {static:false}) mapElement: ElementRef;
  map: google.maps.Map;
  constructor(private router: Router, private routerOutlet: IonRouterOutlet, private menu: MenuController) { }

  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
    this.menu.swipeGesture(false);
  }

  ionViewWillEnter(){
    this.loadMap();
  }

  cancel() {
    this.router.navigate([".."]);
  }

  loadMap(){
    let latLng = new google.maps.LatLng(43.040119796976896, -87.93435173870222);
    let mapOptions : google.maps.MapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

}
