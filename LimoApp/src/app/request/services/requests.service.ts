import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Request } from '../../interfaces/request';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private functions: AngularFireFunctions) { }

  // Call addRequest cloud function (LimoApp/functions/src/index.ts)
  request(data: Request) {
    const callable = this.functions.httpsCallable("addRequest");
    return callable(data);
  }

  // Call cancelRequest cloud function (LimoApp/functions/src/index.ts)
  cancel(data) {
    const callable = this.functions.httpsCallable("cancelRequest");
    return callable(data);
  }

}
