import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './driver/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { take } from 'rxjs/operators';
import { Location } from './interfaces/location';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private db: AngularFirestore,
    private storage: Storage,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService) { }

  async ngOnInit() {
    await this.storage.create()
    // Checks if user has already requested a ride.
    const userId = await this.storage.get("userId");
    if (userId != "" && userId != null) {
      // Checks with server if ride is active.
      await this.db.collection("requests").doc(userId).get().pipe(take(1)).subscribe(async (request) => {
        if (request.exists) {
          // Navigates to ride screen.
          const data: any = request.data();
          this.router.navigateByUrl("request/ride", {state: { pickup: data.pickup, dropoff: data.dropoff, confirmed: true }})
        } else {
          // Discards old ride information.
          await this.storage.remove("userId");
          await this.storage.remove("driverId");
        }
      });
    }
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
