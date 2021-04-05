import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  fontsize: number = 0.75;
  _username: string;
  _password: string;
  empty: boolean = true;
  failedLogin: boolean = false;

  // Getters and setters for two way data binding from username input.
  get username() {
    return this._username;
  }

  set username(val: string) {
    this._username = val;
  }

  // Getters and setters for two way data binding from password input.
  get password() {
    return this._password;
  }

  set password(val: string) {
    this._password = val;
  }

  constructor(private router: Router, private route: ActivatedRoute, private routerOutlet: IonRouterOutlet, private menu: MenuController) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when page is first loaded
  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
  }

  // Username/password are currently hardcoded. Will implement authentication server in future implementations.
  // This method is called with angular event binding in the HTML file.
  authenticate() {
    if (this.username === "admin" && this.password === "password"){
      this._username = "";
      this._password = "";
      this.failedLogin = false;
      this.router.navigate(['tasks'], {relativeTo: this.route})
    } else {
      this._username = "";
      this._password = "";
      this.failedLogin = true;
      this.fontsize += 0.05;
    }

  }

}
