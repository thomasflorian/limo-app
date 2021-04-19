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

  constructor(private menu: MenuController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private db: AngularFirestore) { }

  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  ngOnInit() {
  }

  signOut() {
    this.authService.signOut();
    this.navCtrl.navigateBack([".."]);
  }

  start() {
    this.router.navigate(["driver", "tasks"])
  }

}
