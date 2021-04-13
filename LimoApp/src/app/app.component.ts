import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { LocationsService } from './request/services/locations.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private menu: MenuController) { }

  ngOnInit() {
  }

  // Navigates to location clicked in menu bar.
  navTo(loc: string) {
    this.router.navigate([loc]);
    this.menu.close();
  }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

}
