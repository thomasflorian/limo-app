import { Component, OnInit } from '@angular/core';
import { MenuController, IonRouterOutlet, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  name: string;
  tel: string;
  alerts: string;

  //Getters and setters for name and telephone number


  constructor(private routerOutlet: IonRouterOutlet, private storage: Storage, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.routerOutlet.swipeGesture = false;
    await this.storage.create();
  }

  async save() {
    // Stores name, tel, and alerts values.
    await this.storage.set('name', this.name);
    await this.storage.set('tel', this.tel);
    await this.storage.set('alerts', this.alerts);
    this.router.navigate(["request"], {relativeTo: this.route.parent})
  }
}

