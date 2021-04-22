import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Request } from '../../interfaces/request';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private functions: AngularFireFunctions) { }

  request(data: Request) {
    const callable = this.functions.httpsCallable("addRequest");
    return callable(data);
  }

}
