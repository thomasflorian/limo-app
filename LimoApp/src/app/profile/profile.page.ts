import { Component, OnInit } from '@angular/core';
import { MenuController, IonRouterOutlet, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  name: string;
  tel: string;
  alerts: string;

  constructor(private plt: Platform, private storage: Storage, private router: Router, private route: ActivatedRoute, private menu: MenuController, private routerOutlet: IonRouterOutlet) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when page first loads.
  async ngOnInit() {
    // Disables ability to swipe back to previous page.
    this.routerOutlet.swipeGesture = false;
    await this.storage.create();
    // Retrieves name, tel, and alerts values.
    this.name = await this.storage.get('name');
    this.tel = await this.storage.get('tel');
    this.alerts = await this.storage.get('alerts')
  }

  async save() {
    // Stores name, tel, and alerts values.
    await this.storage.set('name', this.name);
    await this.storage.set('tel', this.tel);
    await this.storage.set('alerts', this.alerts);
    this.router.navigate(["request"], {relativeTo: this.route.parent})
  }

}
