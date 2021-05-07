import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../../interfaces/location';
import {
  IonRouterOutlet,
  MenuController,
  NavController,
  Platform,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage-angular';
import * as firebase from 'firebase';
import { RequestsService } from '../services/requests.service';
import { RideRequest, CancelRequest } from 'src/app/interfaces/request';
@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage {
  eta: number = 7;
  pickupLoc: Location;
  dropoffLoc: Location;
  confirmed: boolean = false;
  pickedUp: boolean = false;

  // ViewChild selects the div element with id:"map" to load the map into.
  @ViewChild('map', {
    static: false,
  })
  mapElement: ElementRef;
  map: google.maps.Map;
  sub: any;
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private requestsService: RequestsService,
    private storage: Storage,
    private db: AngularFirestore,
    private geolocation: Geolocation,
    private plt: Platform,
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private routerOutlet: IonRouterOutlet,
    private menu: MenuController
  ) {
    this.menu.swipeGesture(false);
    if (this.router.getCurrentNavigation().extras.state == null) {
      // TODO: This is a temp error fix. Change behavior in later development.
      this.navCtrl.navigateBack(['']);
    } else {
      this.pickupLoc = this.router.getCurrentNavigation().extras.state.pickup;
      this.dropoffLoc = this.router.getCurrentNavigation().extras.state.dropoff;
      this.confirmed = this.router.getCurrentNavigation().extras.state.confirmed;
    }
  }

  // Runs when page first loads.
  ionViewWillEnter() {
    // Disables swipe gestures for opening menu and returning to previous page.
    // TODO: Look into android back button and how that'll effect the app.
    this.loadMap();
    this.loadRoute();
  }

  // Runs when confirm button is clicked.
  async confirm() {
    const name: string = await this.storage.get('name');
    const time = firebase.default.firestore.Timestamp.now();
    const userId = name + time.valueOf(); // primitive id for testing purposes. should be practically impossible to generate two identical ids.

    const loading = await this.loadingController.create();
    await loading.present();
    // Create ride request.
    const data: RideRequest = {
      id: userId,
      name: name,
      time: time,
      pickup: this.pickupLoc,
      dropoff: this.dropoffLoc,
    };
    // Send ride request to server.
    this.requestsService.request(data).subscribe(
      async (res) => {
        // Record assigned driver id.
        await this.storage.set('driverId', res.driverID);
        await this.storage.set('userId', userId);
        loading.dismiss();
        this.confirmed = true;
        this.sub = this.db
          .collection('requests')
          .doc(userId)
          .valueChanges()
          .subscribe(async (res: any) => {
            if (res == null) {
              if (this.pickedUp) {
                const cancelError = await this.alertController.create({
                  header: 'Completed',
                  message: 'Your ride has been completed!',
                  buttons: ['OK'],
                });
                await cancelError.present();
              } else {
                const cancelError = await this.alertController.create({
                  header: 'Canceled',
                  message: 'Your ride has been canceled by the driver.',
                  buttons: ['OK'],
                });
                await cancelError.present();
              }
              this.router.navigateByUrl('');
            } else if (res.pickedUp) {
              this.pickedUp = true;
              this.eta = 4;
            }
          });
      },
      async (err) => {
        loading.dismiss();
        const requestError = await this.alertController.create({
          header: 'Request Error',
          message: 'Error requesting ride.',
          buttons: ['OK'],
        });
        await requestError.present();
      }
    );
  }
  // Runs when back button is clicked;
  back() {
    this.navCtrl.navigateBack(['..']);
  }

  // Runs when cancel button is clicked.
  async cancel() {
    const loading = await this.loadingController.create();
    const userId = await this.storage.get('userId');
    const driverId = await this.storage.get('driverId');
    this.sub?.unsubscribe();
    await loading.present();
    // Create cancel request
    const data: CancelRequest = {
      id: userId,
      driverId: driverId,
    };
    // Send cancel request to server
    this.requestsService.cancel(data).subscribe(
      async (res) => {
        await this.storage.remove('userId');
        await this.storage.remove('driverId');
        loading.dismiss();
        this.navCtrl.navigateBack('request');
      },
      async (err) => {
        loading.dismiss();
        const requestError = await this.alertController.create({
          header: 'Request Error',
          message: 'Error canceling ride.',
          buttons: ['OK'],
        });
        await requestError.present();
      }
    );
  }

  // Loads the google map api
  loadMap() {
    let center = [
      (this.pickupLoc.lat + this.dropoffLoc.lat) / 2,
      (this.pickupLoc.lng + this.dropoffLoc.lng) / 2,
    ];
    // Set map options
    let mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(center[0], center[1]),
      zoom: 16,
      // this mapId corresponds to custom styling of the map.
      // refer to: https://developers.google.com/maps/documentation/javascript/styling
      mapId: 'aaba5aeca8b4e8c4',
      disableDefaultUI: true,
      restriction: {
        latLngBounds: {
          north: 43.046,
          south: 43.031,
          west: -87.944,
          east: -87.916,
        },
        strictBounds: false,
      },
    } as google.maps.MapOptions;
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  // Loads the route from pickup to dropoff location on the map
  loadRoute() {
    this.loadMap();
    let directionService = new google.maps.DirectionsService();
    let request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(this.pickupLoc.lat, this.pickupLoc.lng),
      destination: new google.maps.LatLng(
        this.dropoffLoc.lat,
        this.dropoffLoc.lng
      ),
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false,
    };
    directionService.route(request, (result, status) => {
      new google.maps.DirectionsRenderer({
        map: this.map,
        directions: result,
      });
    });
  }
}
