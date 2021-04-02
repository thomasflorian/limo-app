import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  constructor(private menu : MenuController) { }

  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  ngOnInit() {
  }

}
