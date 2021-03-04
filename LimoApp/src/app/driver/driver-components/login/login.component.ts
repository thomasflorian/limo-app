import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  _username: string;
  _password: string;
  failedLogin: boolean = false;

  get username() {
    return this._username;
  }

  set username(val: string) {
    this._username = val;
  }

  get password() {
    return this._password;
  }

  set password(val: string) {
    this._password = val;
  }

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {}

  authenticate() {
    if (this.username === "admin" && this.password === "password"){
      this.router.navigate(['home'], {relativeTo: this.route.parent})
    } else {
      this._username = "";
      this._password = "";
      this.failedLogin = true;
    }

  }


}
