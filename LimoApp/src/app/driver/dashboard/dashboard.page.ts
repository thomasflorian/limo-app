import { GeolocationService } from './../../services/geolocation.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private geolocationService: GeolocationService,
    private menu: MenuController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private db: AngularFirestore) { }

  openMenu() {
    this.menu.enable(true, 'drivermenu');
    this.menu.open('drivermenu');
  }

  ngOnInit() {
  }

  async start() {
    const user = this.authService.currentUser.getValue();
    if (user?.role == "DRIVER") {
      await this.db.collection("drivers").doc(`${user.id}`).set({ requests: [], position: [] })
      this.router.navigate(["driver", "tasks"]);
    }
  }

}
