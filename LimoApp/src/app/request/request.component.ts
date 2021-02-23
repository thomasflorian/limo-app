import { LocationService } from './location.service';
import { ILocation } from './../shared/ILocation';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {

  _filter : string = "";
  locations : ILocation[];
  filteredLocations : ILocation[];

  @Input()
  get filter() {
    return this._filter;
  }
  
  set filter(val: string) { 
    this._filter = val;
    this.getFilteredLocations(this._filter);
  }

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.locations = this.locationService.getLocations();
    this.getFilteredLocations(this._filter);
  }

  getFilteredLocations(input : string) {
    if (input !== "") {
      let starts : ILocation[] = this.locations.filter((loc) => loc.name.toLowerCase().startsWith(input.toLowerCase()));
      let contains : ILocation[] = this.locations.filter((loc) => !loc.name.toLowerCase().startsWith(input.toLowerCase()) && loc.name.toLowerCase().includes(input.toLowerCase()))
      this.filteredLocations = starts.concat(contains).slice(0,5);
    } else {
      this.filteredLocations = [];
    }
  }

}
