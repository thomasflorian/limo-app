import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from './../../interfaces/location';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  locations: Location[];

  constructor(private db: AngularFirestore) {
  }

  async getLocations() {
    if (!this.locations) {
      const snapshot = await this.db.collection("locations").get();
      this.locations = (await snapshot.toPromise()).docs.map(doc => doc.data()) as Location[];
    }
    return this.locations;
  }

}
