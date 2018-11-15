import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FirebaseUserService } from '../firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    public firebaseService: FirebaseUserService
  ) { }

  doSignUp = (value) => {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(user => {
        resolve(user);
        this.firebaseService.createUser({
          firstName: 'Test',
          lastName: 'Test',
          email: value.email,
          id: user.user.uid,
        })
      }, err => reject(err));
    });
  }

  doLogin = (value) => {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogout = () => {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }

  doPasswordUpdate = (password: string) => {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.currentUser.updatePassword(password);
        resolve();
      } else {
        reject();
      }
    });
  }

  doPasswordReset = (email: string) => {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }
}
