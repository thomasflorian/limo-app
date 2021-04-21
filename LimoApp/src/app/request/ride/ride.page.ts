import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../../interfaces/location';
import { IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage-angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  eta: number = 8;
  pickupLoc: Location;
  dropoffLoc: Location;
  confirmed: boolean = false;

  // ViewChild selects the div element with id:"map" to load the map into.
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: google.maps.Map;
  constructor( private storage: Storage,
    private db: AngularFirestore,
    private geolocation: Geolocation, 
    private plt: Platform, 
    private navCtrl: NavController, 
    private router: Router, 
    private route: ActivatedRoute, 
    private routerOutlet: IonRouterOutlet, 
    private menu: MenuController) { }

  // Runs when page first loads.
  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state == null) {
      // TODO: This is a temp error fix. Change behavior in later development.
      this.navCtrl.navigateBack([".."]);
    } else {
      // Disables swipe gestures for opening menu and returning to previous page.
      // TODO: Look into android back button and how that'll effect the app.
      this.routerOutlet.swipeGesture = false;
      this.menu.swipeGesture(false);
      this.pickupLoc = this.router.getCurrentNavigation().extras.state.pickup;
      this.dropoffLoc = this.router.getCurrentNavigation().extras.state.dropoff;
    }
  }

  // Load the map once the view is loaded
  ionViewDidEnter() {
    this.loadMap();
    this.loadRoute();
  }

  // Runs when confirm button is clicked.
  async confirm() {
    this.storage.get("name").then(async (name) => {
      await this.db.collection("requests").doc().set({
        name: name,
        time: firebase.default.firestore.Timestamp.now(),
        pickup: this.pickupLoc.name,
        dropoff: this.dropoffLoc.name,
        pickupLatLng: new firebase.default.firestore.GeoPoint(this.pickupLoc.lat, this.pickupLoc.lng),
        dropoffLatLng: new firebase.default.firestore.GeoPoint(this.dropoffLoc.lat, this.dropoffLoc.lng)
      })
    })
    this.confirmed = true;
  }
  // Runs when back button is clicked;
  back() {
    this.navCtrl.navigateBack([".."]);
  }

  // Runs when cancel button is clicked.
  cancel() {
    this.navCtrl.navigateBack([".."]);
  }

  // Loads the google map api
  loadMap() {
    let center = [(this.pickupLoc?.lat + this.dropoffLoc?.lat)/2, (this.pickupLoc?.lng + this.dropoffLoc?.lng)/2]
    // Set map options
    let mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(center[0], center[1]),
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

  // Loads the route from pickup to dropoff location on the map
  loadRoute() {
    this.loadMap();
    let directionService = new google.maps.DirectionsService();
    let request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(this.pickupLoc.lat, this.pickupLoc.lng),
      destination: new google.maps.LatLng(this.dropoffLoc.lat, this.dropoffLoc.lng),
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false
    }
    directionService.route(request, (result, status) => {
      new google.maps.DirectionsRenderer({
        map: this.map,
        directions: result
      });
    })
  }

}
