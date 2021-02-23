import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  loading : boolean = true;

  constructor() {}

  OnInit(){
    setTimeout(() => {console.log('map loaded');}, 10000);
    this.loading = false;
  }
}
