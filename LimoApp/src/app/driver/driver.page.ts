import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, IonRouterOutlet, LoadingController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  email: string;
  password: string;
  failedLogin: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private routerOutlet: IonRouterOutlet,
    private menu: MenuController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private db: AngularFirestore) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when page is first loaded
  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
  }

  // Check email/password with google firebase backend
  async signIn() {
    // Create loading modal
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signIn({ email: this.email, password: this.password }).then((res) => {
      res.subscribe((user) => {
        // Successful login -> navigate to task page
        loading.dismiss();
        this.failedLogin = false;
        this.menu.enable(true, 'drivermenu');
        this.router.navigateByUrl("driver/dashboard", {state: res});
      }, async err => {
        // Unsuccessful login -> display notification
        loading.dismiss();
        this.failedLogin = true;
      });
    });

  }

}
