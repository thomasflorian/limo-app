import { Location } from './../interfaces/location';
import { LocationsService } from './locations.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @ViewChild('pickupID') pickupInput;
  map: google.maps.Map;

  locations: Location[];
  filteredLocations: Location[];

  currentLatLng: google.maps.LatLng;

  _pickup: string = "";
  pickupLoc: Location;
  _dropoff: string = "";
  dropoffLoc: Location;
  pickupHasFocus: boolean;
  dropoffHasFocus: boolean;
  loading: boolean = true;

  get pickup() {
    return this._pickup;
  }

  set pickup(val) {
    this._pickup = val;
    this.getFilteredLocations(this._pickup);
  }

  get dropoff() {
    return this._dropoff;
  }

  set dropoff(val) {
    this._dropoff = val;
    this.getFilteredLocations(this._dropoff);
  }

  constructor(private geolocation: Geolocation, private plt: Platform, private router: Router, private route: ActivatedRoute, private routerOutlet: IonRouterOutlet, private menu: MenuController, private locationsService: LocationsService) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when component first loads.
  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
    // Loads in location data.
    this.locations = this.locationsService.getLocations();
    this.filteredLocations = [];
    // Waits for platform to be ready.
    this.plt.ready().then(() => {
      // Loads in map
      this.loadMap();
      this.loadGeolocation();
    });
  }

  loadGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let closestLocation = { index: 0, distance: Number.MAX_VALUE };
      for (let i = 0; i < this.locations.length; i++) {
        let distance = this.getDistance([this.currentLatLng.lat(), this.currentLatLng.lng()], this.locations[i].gps);
        if (closestLocation.distance > distance) {
          closestLocation = { index: i, distance: distance };
        }
      }
      this._pickup = this.locations[closestLocation.index].name;
      this.pickupLoc = this.locations[closestLocation.index];
    }).finally(() => this.loading = false);
  }

  getDistance(loc1: number[], loc2: number[]) {
    if (loc1.length !== 2 || loc2.length !== 2) {
      throw new Error('getDistance invoked improperly. loc1 and loc2 should have a length of 2.');
    }
    return Math.sqrt(Math.pow(loc1[0] - loc2[0], 2) + Math.pow(loc1[1] - loc2[1], 2));
  }

  // Loads the google map api
  loadMap() {
    // Set map options
    let mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(43.03975745924356, -87.9308424643562),
      zoom: 16,
      // this mapId corresponds to custom styling of the map.
      mapId: "aaba5aeca8b4e8c4",
      disableDefaultUI: true
    } as google.maps.MapOptions;
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  request() {
    if (this.pickupLoc != null && this.dropoffLoc != null) {
      this.router.navigate(["ride"], { relativeTo: this.route, state: { pickup: this.pickupLoc, dropoff: this.dropoffLoc } });
    }
  }

  pickupFocus() {
    this.pickupHasFocus = true;
    this.dropoffHasFocus = false;
    if (!this.pickupLoc) {
      this.getFilteredLocations(this.pickup);
    }
  }

  pickupBlur() {
  }

  pickupChange() {
    this.getFilteredLocations(this._pickup);
    this.pickupLoc = null;
  }

  dropoffFocus() {
    this.dropoffHasFocus = true;
    this.pickupHasFocus = false;
    if (!this.dropoffLoc) {
      this.getFilteredLocations(this.dropoff);
    }
  }

  dropoffBlur() {
  }

  dropoffChange() {
    this.getFilteredLocations(this._dropoff);
    this.dropoffLoc = null;
  }

  itemClick(loc: Location) {
    if (this.pickupHasFocus) {
      this.pickup = loc.name;
      this.pickupLoc = loc;
    }
    if (this.dropoffHasFocus) {
      this.dropoff = loc.name;
      this.dropoffLoc = loc;
    }
    this.filteredLocations = [];
    // if both locations are selected, load the route on the map
    if (this.pickupLoc != null && this.dropoffLoc != null) {
      this.loadRoute();
    }
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

  // Gets filtered locations from search bar input.
  getFilteredLocations(input: string) {
    if (input !== "") {
      // Filter first selects locations that start with filter string and then locations that contain filter string.
      let starts: Location[] = this.locations.filter((loc) => loc.name.toLowerCase().startsWith(input.toLowerCase()));
      let contains: Location[] = this.locations.filter((loc) => !loc.name.toLowerCase().startsWith(input.toLowerCase()) && loc.name.toLowerCase().includes(input.toLowerCase()))
      this.filteredLocations = starts.concat(contains).slice(0, 6);
    } else {
      this.filteredLocations = [];
    }
  }

}
