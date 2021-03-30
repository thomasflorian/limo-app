import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private _name : string;

  get name() {
    return this._name;
  }
  set name(val : string){
    this._name = val;
  }

  constructor() { }

  ngOnInit() {
  }

}
