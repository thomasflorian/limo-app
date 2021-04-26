import { MenuController } from '@ionic/angular';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { filter, map, take } from 'rxjs/operators';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  // ViewChild selects the div element with id:"map" to load the map into.
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: google.maps.Map;
  driver;
  requests;
  location;

  constructor(private geolocation: Geolocation,
    private authService: AuthService,
    private db: AngularFirestore,
    private menu: MenuController) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'drivermenu');
    this.menu.open('drivermenu');
  }

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => this.driver = user);
    this.requests = this.db.collection("drivers").doc(this.driver.id).valueChanges().pipe(filter(resp => resp != null), map<any,any[]>(resp => resp.requests));
    this.geolocation.watchPosition().subscribe((pos) => {
      this.db.collection("drivers").doc(this.driver.id).update({ position: new firebase.default.firestore.GeoPoint((<Geoposition>pos).coords.latitude, (<Geoposition>pos).coords.longitude) });
      this.location = new google.maps.LatLng((<Geoposition>pos).coords.latitude, (<Geoposition>pos).coords.longitude);
      this.map.setCenter(this.location);
    });
  }

  // Load the map once the view is loaded
  ionViewDidEnter() {
    this.loadMap();
  }


  loadMap() {
    // Set map options
    let mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(43.03882144005844, -87.92867082941946),
      zoom: 16,
      // this mapId corresponds to custom styling of the map.
      // refer to: https://developers.google.com/maps/documentation/javascript/styling
      mapId: "aaba5aeca8b4e8c4",
      disableDefaultUI: true,
      restriction: {
        latLngBounds: { north: 43.046, south: 43.031, west: -87.944, east: -87.916 },
        strictBounds: false
      }
    } as google.maps.MapOptions;
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

}
