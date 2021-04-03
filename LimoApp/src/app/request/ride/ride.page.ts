import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../../interfaces/location';
import { IonRouterOutlet, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  selectedLocation: Location;

  @ViewChild('map', {static:false}) mapElement: ElementRef;
  map: google.maps.Map;
  constructor(private router: Router, private route: ActivatedRoute, private routerOutlet: IonRouterOutlet, private menu: MenuController) { }

  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
    this.menu.swipeGesture(false);
    this.selectedLocation = this.router.getCurrentNavigation().extras.state.loc;
  }

  ionViewWillEnter(){
    this.loadMap();
  }

  cancel() {
    this.router.navigate([".."]);
  }

  loadMap(){ 
    let latLng = new google.maps.LatLng(this.selectedLocation.gps[0], this.selectedLocation.gps[1]);
    let mapOptions : google.maps.MapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

}
