import { LocationService } from './location.service';
import { ILocation } from '../../../shared/ILocation';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {

  _filter: string = "";
  locations: ILocation[];
  selectedLocation: ILocation;
  filteredLocations: ILocation[];
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

  constructor(private locationService: LocationService) { }

  // Runs when component first loads.
  ngOnInit() {
    // Loads in location data.
    this.locations = this.locationService.getLocations();
    this.filteredLocations = [];
  }

  // Runs when list item is clicked.
  onClick(loc: ILocation) {
    // Highlights selected item in list.
    this.selectedLocation = loc;
    this.disabled = false;
  }

  // Gets filtered locations from search bar input.
  getFilteredLocations(input: string) {
    if (input !== "") {
      // Filter first selects locations that start with filter string and then locations that contain filter string.
      let starts: ILocation[] = this.locations.filter((loc) => loc.name.toLowerCase().startsWith(input.toLowerCase()));
      let contains: ILocation[] = this.locations.filter((loc) => !loc.name.toLowerCase().startsWith(input.toLowerCase()) && loc.name.toLowerCase().includes(input.toLowerCase()))
      this.filteredLocations = starts.concat(contains).slice(0, 5);
    } else {
      this.filteredLocations = [];
    }
    this.selectedLocation = null;
    this.disabled = true;
  }

}
