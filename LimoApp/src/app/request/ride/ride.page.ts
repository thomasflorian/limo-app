import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../../interfaces/location';
import { AlertController, IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  eta: number = 8;
  destination: Location;
  destinationLatLng: google.maps.LatLng; w
  currLatLng: google.maps.LatLng;
  directions: google.maps.DirectionsResult;

  _pickup: string;
  _dropoff: string;
  // Getters and setters for two way data binding from pickup input.
  get pickup() {
    return this._pickup;
  }

  set pickup(val: string) {
    this._pickup = val;
  }

  // Getters and setters for two way data binding from dropoff input.
  get dropoff() {
    return this._dropoff;
  }

  set dropoff(val: string) {
    this._dropoff = val;
  }

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
      // Loads the location that was selected in the request page.
      this.destination = this.router.getCurrentNavigation().extras.state.loc;
      this.destinationLatLng = new google.maps.LatLng(this.destination.gps[0], this.destination.gps[1]);
      // Make sure platform is ready before loading map.
      this.plt.ready().then(() => {
        // Loads map
        this.loadMap();
        this.loadUserPosition().then(resp => {
          this.currLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          this.prefillInputs();
          this.loadDirections();
        })
      })
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
      center: this.destinationLatLng,
      zoom: 16,
      mapId: "aaba5aeca8b4e8c4",
      disableDefaultUI: true
    } as google.maps.MapOptions;
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  loadUserPosition() {
    return this.geolocation.getCurrentPosition();
  }

  loadDirections() {
    let directionService = new google.maps.DirectionsService();
    let request: google.maps.DirectionsRequest = {
      origin: this.currLatLng,
      destination: this.destinationLatLng,
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

  prefillInputs() {
    let geocoder = new google.maps.Geocoder();
    let request: google.maps.GeocoderRequest = {
      location: this.currLatLng
    };
    geocoder.geocode(request, (results, status) => {
      this.dropoff = this.destination.name;
      if (status == google.maps.GeocoderStatus.OK) {
        this.pickup = results[0].address_components[0].short_name + " " + results[0].address_components[1].short_name
      }
    })
  }

}
