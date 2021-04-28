import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  driver: any;

  constructor(
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
    this.authService.currentUser.subscribe((user) => {
      this.driver = user;
      console.log(this.driver);
    });
  }

  async start() {
    if (this.driver?.role == "DRIVER") {
      await this.db.collection("drivers").doc(`${this.driver.id}`).set({ requests: [], position: [], curRiders: 0, queuedRiders: 0 })
      this.router.navigateByUrl("driver/tasks");
    }
  }

}
