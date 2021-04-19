import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  requests = [];

  constructor(private db: AngularFirestore, 
    private menu : MenuController) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  ngOnInit() {
    this.db.collection("requests").valueChanges().subscribe({
      next: (resp:any[]) => {
        this.requests = resp;
      }
    });
  }

}
