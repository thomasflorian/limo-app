import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from './../../interfaces/location';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  locations: Location[] = [];

  constructor(private db: AngularFirestore) {
    // Get all locations from google firebase backend
    this.db.collection("locations").get().toPromise().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          this.locations.push(doc.data() as Location);
      });
    });
  }

  // Return the sorted list of locations
  getLocations() : Location[] {
    return this.locations.sort((a, b) => a.name.localeCompare(b.name));
  }

}
