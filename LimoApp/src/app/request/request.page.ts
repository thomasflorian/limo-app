import { Location } from './../interfaces/Location';
import { LocationsService } from './locations.service';
import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {

  _filter: string = "";
  locations: Location[];
  selectedLocation: Location;
  filteredLocations: Location[];
  disabled: boolean = true;

  // Getter and setter for two way data binding from search bar.
  get filter() {
    return this._filter;
  }

  set filter(val: string) {
    this._filter = val;
    // Updates results when search bar input is updated.
    this.getFilteredLocations(this._filter);
  }

  constructor(private router: Router, private route: ActivatedRoute, private routerOutlet: IonRouterOutlet, private menu: MenuController, private locationsService: LocationsService) { }

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
  }

  // Runs when list item is clicked.
  itemClick(loc: Location) {
    // Highlights selected item in list.
    this.selectedLocation = loc;
    this.disabled = false;
  }

  request() {
    this.router.navigate(['ride'], {relativeTo: this.route})
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
    this.selectedLocation = null;
    this.disabled = true;
  }

}
