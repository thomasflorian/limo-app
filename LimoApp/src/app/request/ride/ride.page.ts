import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../../interfaces/location';
import { IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  selectedLocation: Location;

  // ViewChild selects the div element with id:"map" to load the map into.
  @ViewChild('map', {static:false}) mapElement: ElementRef;
  map: google.maps.Map;
  constructor(private geolocation: Geolocation, private plt: Platform, private navCtrl: NavController, private router: Router, private route: ActivatedRoute, private routerOutlet: IonRouterOutlet, private menu: MenuController) { }

  // Runs when page first loads.
  ngOnInit() {
    // Disables swipe gestures for opening menu and returning to previous page.
    // TODO: Look into android back button and how that'll effect the app.
    this.routerOutlet.swipeGesture = false;
    this.menu.swipeGesture(false);
    // Loads the location that was selected in the request page.
    this.selectedLocation = this.router.getCurrentNavigation().extras.state.loc;
    // Loads map
    this.loadMap()
  }

  // Runs everytime page is loaded.
  ionViewWillEnter(){
  }

  // Runs when cancel buttin is clicked.
  cancel() {
    this.navCtrl.pop();
  }

  // Loads the google map api
  loadMap(){ 
    // Make sure platform is ready before loading map.
    this.plt.ready().then(() => {
      // Set map options
    let latLng = new google.maps.LatLng(this.selectedLocation.gps[0], this.selectedLocation.gps[1]);
    let mapOptions : google.maps.MapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    });
  }

  loadUserPosition(){
    this.plt.ready().then(() => {


    })
  }

}
