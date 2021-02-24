import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  hidden: boolean = false;

  constructor() { }

  ngOnInit() {
    setTimeout( () => { this.hidden = true; }, 3000 );
  }
}
