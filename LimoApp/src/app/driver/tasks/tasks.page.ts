import {
  ActionSheetController,
  AlertController,
  LoadingController,
  MenuController,
} from '@ionic/angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { CancelRequest } from 'src/app/interfaces/request';
import { RequestsService } from 'src/app/request/services/requests.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  // ViewChild selects the div element with id:"map" to load the map into.
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: google.maps.Map;
  requests: Observable<object[]>;
  location: google.maps.LatLng;
  authListener: Subscription;
  geolocListener: Subscription;
  driverId: any;

  constructor(
    private geolocation: Geolocation,
    private authService: AuthService,
    private db: AngularFirestore,
    private menu: MenuController,
    private actionSheetController: ActionSheetController,
    private requestsService: RequestsService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'drivermenu');
    this.menu.open('drivermenu');
  }

  // Runs when view is loaded.
  ionViewWillEnter() {
    // Loads the map.
    this.loadMap();
    // Subscribes to driver information.
    this.authListener = this.authService.currentUser
      .pipe(filter((user) => user != null))
      .subscribe((user) => {
        this.driverId = user.id;
        // Gets list of requests of driver.
        this.requests = this.db
          .collection('drivers')
          .doc(user.id)
          .valueChanges()
          .pipe(
            filter((resp) => resp != null),
            map<any, any[]>((resp) => resp.requests)
          );
        // Unsubscribe from old geolocation subscription to perserve memory.
        this.geolocListener?.unsubscribe();
        // Subscribe to current position of driver.
        this.geolocListener = this.geolocation
          .watchPosition()
          .subscribe((pos) => {
            // Update current position of driver in database.
            this.db
              .collection('drivers')
              .doc(user.id)
              .update({
                position: new firebase.default.firestore.GeoPoint(
                  (<Geoposition>pos).coords.latitude,
                  (<Geoposition>pos).coords.longitude
                ),
              });
            this.location = new google.maps.LatLng(
              (<Geoposition>pos).coords.latitude,
              (<Geoposition>pos).coords.longitude
            );
            // Center map on current position of driver in database.
            this.map.setCenter(this.location);
          });
      });
  }

  // Runs when view is left.
  ionViewWillLeave() {
    // Unsubscribe to perserve memory.
    this.authListener.unsubscribe();
    this.geolocListener.unsubscribe();
  }

  async taskClick(request) {
    if (!request.pickedUp) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Pickup ' + request.name + ' at ' + request.pickup.name,
        buttons: [
          {
            text: 'Confirm Pickup',
            icon: 'checkmark-outline',
            handler: () => {
              this.requestsService
                .pickUp({ id: request.id, driverId: this.driverId })
                .subscribe();
            },
          },
          {
            text: 'No show',
            role: 'destructive',
            icon: 'trash',
            handler: async () => {
              // Create cancel request
              const data: CancelRequest = {
                id: request.id,
                driverId: this.driverId,
              };
              // Send cancel request to server
              const loading = await this.loadingController.create();
              loading.present();
              this.requestsService.cancel(data).subscribe(
                (res) => {
                  loading.dismiss();
                },
                async (err) => {
                  const requestError = await this.alertController.create({
                    header: 'Request Error',
                    message: 'Error canceling ride.',
                    buttons: ['OK'],
                  });
                  await requestError.present();
                }
              );
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      });
      await actionSheet.present();
    } else {
      const actionSheet = await this.actionSheetController.create({
        header: 'Dropoff ' + request.name + ' at ' + request.dropoff.name,
        buttons: [
          {
            text: 'Confirm Dropoff',
            icon: 'checkmark-outline',
            handler: async () => {
              // Create cancel request
              const data: CancelRequest = {
                id: request.id,
                driverId: this.driverId,
              };
              // Send cancel request to server
              const loading = await this.loadingController.create();
              loading.present();
              this.requestsService.cancel(data).subscribe(
                (res) => {
                  loading.dismiss();
                },
                async (err) => {
                  const requestError = await this.alertController.create({
                    header: 'Request Error',
                    message: 'Error canceling ride.',
                    buttons: ['OK'],
                  });
                  await requestError.present();
                }
              );
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      });
      await actionSheet.present();
    }
  }

  // Loads the map.
  loadMap() {
    // Set map options
    let mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(43.03882144005844, -87.92867082941946),
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
}
