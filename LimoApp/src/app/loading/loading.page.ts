import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  hidden: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout( () => { this.router.navigate(['/home']) }, 500 );
  }
}
