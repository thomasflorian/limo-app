import { Component, OnInit } from '@angular/core';
import { MenuController, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private menu: MenuController, private routerOutlet: IonRouterOutlet) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when page first loads.
  ngOnInit() {
    // Disables ability to swipe back to previous page.
    this.routerOutlet.swipeGesture = false;
  }
}
