import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser = new BehaviorSubject(null);

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router, private menu: MenuController) {
    // authState observable will call next() when the authState is changed.
    this.afAuth.authState.subscribe(async user => {
      if (user) {
        this.db.doc(`users/${user.uid}`).valueChanges().pipe(
          // Update current user.
          take(1),
          tap((res: any) => {
            this.currentUser.next({
              email: user.email,
              id: user.uid,
              firstname: res.firstname,
              lastname: res.lastname,
              phone: res.phone,
              role: res.role,
              stat1: res.stat1,
              stat2: res.stat2,
              stat3: res.stat3
            });
            console.log("auth changed: ", user);
            // If driver is logged in, redirect them to active page.
            if (res.role == "DRIVER") {
              this.db.doc(`drivers/${user.uid}`).get().pipe(
                take(1),
                tap((driver) => {
                  if (driver.exists) {
                    this.router.navigateByUrl('driver/tasks');
                  } else {
                    this.router.navigateByUrl('driver/dashboard');
                  }
                })
              ).subscribe();
            }
          })
        ).subscribe();
      }
    })
  }

  // Sign in user to firebase authentication.
  async signIn({ email, password }){
    const res = await this.afAuth.signInWithEmailAndPassword(email, password);
    return this.db.doc(`users/${res.user.uid}`).valueChanges().pipe(take(1));
  }


  // Log out user from firebase authentication. If user was a driver, remove their queue from database.
  async signOut() {
    const user = this.currentUser.getValue();
    if (user?.role == "DRIVER") {
      await this.db.doc(`drivers/${user.id}`).delete();
    }
    this.menu.enable(true, "limomenu");
    this.afAuth.signOut();
    this.currentUser.next(null);
  }
}
