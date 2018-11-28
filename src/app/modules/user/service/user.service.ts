import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AppState } from '../../../../app/store';
import { FirebaseUserService, GroceriesService } from '../../../../app/core/firestore';
import * as SessionActions from '../../../store/session/session.actions';
import { User } from '../../../../app/core/models';

@Injectable()
export class UserService {

  constructor(
   public db: AngularFirestore,
   public afAuth: AngularFireAuth,
   private store: Store<AppState>,
   public firebaseService: FirebaseUserService,
   public groceryService: GroceriesService,
  ){ }

  getCurrentUser = () => {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
          this.firebaseService.getUser(user.uid)
            .subscribe(doc => this.store.dispatch(new SessionActions.SetUser({
              ...doc.payload.data() as User,
              id: user.uid,
            })));
          const groceryIds = [];
          this.groceryService.getGroceryLists()
            .subscribe(groceries => groceries.forEach(list => {
              groceryIds.push({id: list.id, name: list.name});
              this.store.dispatch(new SessionActions.SetGroceryLists(groceryIds))
            }))
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  updateCurrentUser = (value) => {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }
}