import { AuthService } from './../driver/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';
import { Location } from './../interfaces/location';
import { LocationsService } from './services/locations.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonRouterOutlet, MenuController, Platform, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: google.maps.Map;

  name: string = "";
  locations: Location[];
  filteredLocations: Location[];
  currentLatLng: google.maps.LatLng;
  _pickup: string = "";
  pickupLoc: Location;
  _dropoff: string = "";
  dropoffLoc: Location;
  pickupHasFocus: boolean;
  dropoffHasFocus: boolean;
  loading: boolean = true; // Disables input until geolocation is loaded ... change this functionality in future.
  ready: boolean = false; // Disables request button until locations are selected.
  distanceThreshold: number = 0.001;  //Maximum distance allowed to be concidered "at this location" (in degrees lat/lng)

  // Getters and setters for pickup and dropoff fields.
  get pickup() {
    return this._pickup;
  }

  set pickup(val) {
    this._pickup = val;
    this.getFilteredLocations(this._pickup); // updates filtered locations when pickup changes
  }

  get dropoff() {
    return this._dropoff;
  }

  set dropoff(val) {
    this._dropoff = val;
    this.getFilteredLocations(this._dropoff); // updates filtered locations when dropoff changes
  }

  constructor(private geolocation: Geolocation,
    private router: Router,
    private route: ActivatedRoute,
    private routerOutlet: IonRouterOutlet,
    private menu: MenuController,
    private locationsService: LocationsService,
    private storage: Storage,
    private alertController: AlertController,
    private db: AngularFirestore,
    private authService: AuthService) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when component is loaded.
  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
  }

  // Runs once the view is loaded
  async ionViewDidEnter() {
    // Get name from storage
    await this.storage.create();
    this.name = await this.storage.get('name');   //This line does not always work properly in the emulator
    this.checkUserInfo();
    // Load the map
    this.loadMap();
    // Loads in location data.
    this.locationsService.getLocations().then((res) => {
      this.locations = res;
      this.loadGeolocation();
    });
    this.filteredLocations = [];
  }

  // Load in the current position of user
  loadGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      //Finds closest on-campus location
      let closestLocation = { index: 0, distance: Number.MAX_VALUE };
      for (let i = 0; i < this.locations.length; i++) {
        let distance = this.getDistance([this.currentLatLng.lat(), this.currentLatLng.lng()], [this.locations[i].lat, this.locations[i].lng]);
        if (closestLocation.distance > distance) {
          closestLocation = { index: i, distance: distance };
        }
      }
      if (closestLocation.distance <= this.distanceThreshold) {
        this._pickup = this.locations[closestLocation.index].name;
        this.pickupLoc = this.locations[closestLocation.index];
      }
      //Finds closest off-campus location
      else {
        this.reverseGeocodePickup(this.currentLatLng);
      }
    }).finally(() => this.loading = false); // enables input fields after geolocation api is loaded.
  }

  // get distance between locations
  getDistance(loc1: number[], loc2: number[]) {
    if (loc1.length !== 2 || loc2.length !== 2) {
      throw new Error('getDistance invoked improperly. loc1 and loc2 should have a length of 2.');
    }
    return Math.sqrt(Math.pow(loc1[0] - loc2[0], 2) + Math.pow(loc1[1] - loc2[1], 2));
  }

  // reverse geocoding
  reverseGeocodePickup(latLng: google.maps.LatLng) {
    let geocoder = new google.maps.Geocoder();
    let request: google.maps.GeocoderRequest = {
      location: this.currentLatLng
    };
    geocoder.geocode(request, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.pickupLoc = { name: (results[0].address_components[0].short_name + " " + results[0].address_components[1].short_name), address: results[0].formatted_address, lat: latLng.lat(), lng: latLng.lng() };
        this.pickup = this.pickupLoc.name;
      }
    })
  }

  // Loads the google map api
  loadMap() {
    // Set map options
    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(43.03975745924356, -87.9308424643562),
      zoom: 16,
      // this mapId corresponds to custom styling of the map.
      mapId: "aaba5aeca8b4e8c4",
      disableDefaultUI: true,
      //The map will stay within these boundaries (includes off-campus locations)
      restriction: {
        latLngBounds: { north: 43.046, south: 43.031, west: -87.944, east: -87.916 },
        strictBounds: false
      }
    } as google.maps.MapOptions;
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    google.maps.event.trigger(this.map, 'resize');
    this.map.setCenter(mapOptions.center);
  }

  checkUserInfo(){
    // Check if user info available.
    if(!this.profileExists()){
      // Get user information.
      this.router.navigate(["welcome"], { relativeTo: this.route.parent, replaceUrl: true });
    }
  }

  async request() {
    // Check if valid locations are selected.
    if (this.pickupLoc != null && this.dropoffLoc != null) {
      // Check if drivers are available.
      this.db.collection("drivers").valueChanges().pipe(take(1)).subscribe(async (res) => {
        if (res.length != 0) {
          // Check if profile is available.
          if (this.profileExists()) {
            // Navigate to ride page.
            this.router.navigate(["ride"], { relativeTo: this.route, replaceUrl: true, state: { pickup: this.pickupLoc, dropoff: this.dropoffLoc } });
          } else {
            // Present error.
            const profileError = await this.alertController.create({
              header: "Profile Error",
              message: "Please specify a name in the profile tab",
              buttons: ["OK"]
            });
            await profileError.present();
            this.router.navigate(["profile"], { relativeTo: this.route.parent, replaceUrl: true })
          }
        } else {
          // Present error.
          const noDriverError = await this.alertController.create({
            header: "Driver Error",
            message: "There are no drivers at this time",
            buttons: ["OK"]
          });
          await noDriverError.present();
        }
      });
    }
  }

  //Returns true if there is a value in name
  profileExists() {
    return this.name != "";
  }

  pickupFocus() {
    this.pickupHasFocus = true;
    this.dropoffHasFocus = false;
    if (!this.pickupLoc) {
      this.getFilteredLocations(this.pickup);
    }
  }

  pickupInput() {
    this.pickupLoc = null;
    this.ready = false;
  }

  pickupChange() {
    if (this.pickup == "") {
      // Detects if the clear input button is clicked. This extra check is needed since the clear button is not considered a keyboard input so pickupInput() is not triggered.
      this.pickupLoc = null;
      this.ready = false;
    }
  }

  dropoffFocus() {
    this.dropoffHasFocus = true;
    this.pickupHasFocus = false;
    if (!this.dropoffLoc) {
      this.getFilteredLocations(this.dropoff);
    }
  }

  dropoffInput() {
    this.dropoffLoc = null;
    this.ready = false;
  }

  dropoffChange() {
    if (this.dropoff == "") {
      // Detects if the clear input button is clicked. This extra check is needed since the clear button is not considered a keyboard input so dropoffInput() is not triggered.
      this.dropoffLoc = null;
      this.ready = false;
    }
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
      this.ready = true;
      this.loadRoute();
    }
  }

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
