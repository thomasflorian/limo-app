import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private route: ActivatedRoute, private menu: MenuController) {}

  navTo(loc : string){
    this.router.navigate([loc]);
    this.menu.close();
  }

  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }
  
}
