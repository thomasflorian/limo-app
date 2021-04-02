import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  constructor(private router: Router, private routerOutlet: IonRouterOutlet, private menu: MenuController) { }

  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
    this.menu.swipeGesture(false);
  }

  cancel() {
    this.router.navigate([".."]);
  }

}
