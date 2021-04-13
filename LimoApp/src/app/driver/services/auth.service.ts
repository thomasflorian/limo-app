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

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { 
    this.afAuth.authState.subscribe(async user => {
      console.log('AUTH changed: ', user);
      if (user) {
        this.db.doc(`users/${user.uid}`).valueChanges().pipe(
          take(1),
          tap((res: any) => {
            this.currentUser.next({
              email: user.email,
              id: user.uid,
              name: res.name,
              role: res.role
            })
          })
        ).subscribe();
      }
    })
  }

  signIn({ email, password }) {
    const data = from(this.afAuth.signInWithEmailAndPassword(email, password));
    return data.pipe(
      switchMap( res => {
        return this.db.doc(`users/${res.user.uid}`).valueChanges();
      }),
      take(1)
    );
  }
}
