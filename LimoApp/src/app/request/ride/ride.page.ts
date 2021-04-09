import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../../interfaces/location';
import { IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  eta: number = 8;
  pickupLoc: Location;
  dropoffLoc: Location;

  // ViewChild selects the div element with id:"map" to load the map into.
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: google.maps.Map;
  constructor(private geolocation: Geolocation, private plt: Platform, private navCtrl: NavController, private router: Router, private route: ActivatedRoute, private routerOutlet: IonRouterOutlet, private menu: MenuController) { }

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
      this.plt.ready().then(() => {
        this.loadRoute();
      });
    }
  }

  // Runs everytime page is loaded.
  ionViewWillEnter() {
  }

  // Runs when cancel buttin is clicked.
  cancel() {
    this.navCtrl.navigateBack([".."]);
  }

  // Loads the google map api
  loadMap() {
    // Set map options
    let mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(43.03975745924356, -87.9308424643562),
      zoom: 14,
      // this mapId corresponds to custom styling of the map.
      // refer to: https://developers.google.com/maps/documentation/javascript/styling
      mapId: "aaba5aeca8b4e8c4",
      disableDefaultUI: true
    } as google.maps.MapOptions;
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  loadRoute() {
    this.loadMap();
    let directionService = new google.maps.DirectionsService();
    let request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(this.pickupLoc.gps[0], this.pickupLoc.gps[1]),
      destination: new google.maps.LatLng(this.dropoffLoc.gps[0], this.dropoffLoc.gps[1]),
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
