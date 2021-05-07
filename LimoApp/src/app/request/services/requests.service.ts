import { PickupRequest } from './../../interfaces/request';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { RideRequest, CancelRequest } from '../../interfaces/request';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private functions: AngularFireFunctions) { }

  // Call addRequest cloud function (LimoApp/functions/src/index.ts)
  request(data: RideRequest) {
    const callable = this.functions.httpsCallable("addRequest");
    return callable(data);
  }

  // Call cancelRequest cloud function (LimoApp/functions/src/index.ts)
  cancel(data: CancelRequest) {
    const callable = this.functions.httpsCallable("cancelRequest");
    return callable(data);
  }

  pickUp(data: PickupRequest) {
    const callable = this.functions.httpsCallable("pickupRequest");
    return callable(data);
  }

}
