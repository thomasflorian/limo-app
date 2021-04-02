import { Component, OnInit } from '@angular/core';
import { MenuController, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private menu: MenuController, private routerOutlet: IonRouterOutlet) { }

  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }
  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
  }
}
