import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './driver/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(
    private router: Router,
    private menu: MenuController,
    private authService: AuthService) { }

  ngOnInit() {
  }


  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Navigates to location clicked in menu bar.
  navTo(loc: string) {
    this.router.navigate([loc]);
    this.menu.close();
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate([""]);
    this.menu.close();
    this.menu.enable(true, 'limomenu');
  }
}
