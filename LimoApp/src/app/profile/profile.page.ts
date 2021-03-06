import { Component, OnInit } from '@angular/core';
import { MenuController, IonRouterOutlet, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  name: string;
  tel: string;
  alerts: string;
  disabled: boolean = false;

  constructor(private plt: Platform, private storage: Storage, private router: Router, private route: ActivatedRoute, private menu: MenuController) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when page first loads.
  async ionViewWillEnter() {
    // Retrieves name, tel, and alerts values.
    this.name = await this.storage.get('name');
    this.tel = await this.storage.get('tel');
    this.alerts = await this.storage.get('alerts')
  }

  nameChange() {
    // this.disabled = (this.name == "");
  }

  async save() {
    // Stores name, tel, and alerts values.
    await this.storage.set('name', this.name);
    await this.storage.set('tel', this.tel);
    await this.storage.set('alerts', this.alerts);
    this.router.navigateByUrl("");
  }
}
