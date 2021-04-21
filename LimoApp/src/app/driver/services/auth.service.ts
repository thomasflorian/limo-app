import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser = new BehaviorSubject(null);

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    // authState observable will call next() when the authState is changed.
    this.afAuth.authState.subscribe(async user => {
      console.log('AUTH changed: ', user);
      if (user) {
        this.db.doc(`users/${user.uid}`).valueChanges().pipe(
          // Update current user.
          take(1),
          tap((res: any) => {
            this.currentUser.next({
              email: user.email,
              id: user.uid,
              name: res.name,
              role: res.role
            });
            // If driver is logged in, redirect them to active page.
            if (res.role == "DRIVER") {
              this.db.doc(`drivers/${user.uid}`).get().pipe(
                take(1),
                tap((driver) => {
                  if (driver.exists) {
                    this.router.navigateByUrl('driver/tasks')
                  } else {
                    this.router.navigateByUrl('driver/dashboard')
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
  signIn({ email, password }) {
    const data = from(this.afAuth.signInWithEmailAndPassword(email, password));
    return data.pipe(
      switchMap(res => {
        return this.db.doc(`users/${res.user.uid}`).valueChanges();
      }),
      take(1)
    );
  }


  // Log out user from firebase authentication. If user was a driver, remove their queue from database.
  async signOut() {
    const user = this.currentUser.getValue();
    if (user?.role == "DRIVER") {
      console.log(user, ' deleted');
      await this.db.doc(`drivers/${user.id}`).delete();
    }
    this.afAuth.signOut();
    this.currentUser.next(null);
  }
}
