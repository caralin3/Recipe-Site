import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroceryList } from '../models';
import { FirebaseGroceryListModel } from './groceries.model';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  private groceriesCollection: AngularFirestoreCollection<{}>; 

  constructor(public db: AngularFirestore) {
    this.groceriesCollection = db.collection<FirebaseGroceryListModel>('groceries');
  }

  // Get All GroceryLists
  getGroceryLists = (): Observable<GroceryList[]> => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseGroceryListModel>('groceries',
      ref => ref.where('userId', '==', user.uid)).snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data() as FirebaseGroceryListModel;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as GroceryList;
      })
    ));
  }

  // Create GroceryList
  createGroceryList = (grocery: FirebaseGroceryListModel) => {
    return this.groceriesCollection.add(grocery);
  }

  // Get GroceryList
  getGroceryList = (groceryId: string): Observable<GroceryList> => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseGroceryListModel>('groceries',
      ref => ref.where('userId', '==', user.uid))
      .doc(groceryId)
      .snapshotChanges()
      .pipe(map(action => {
        // Get document data
        const data = action.payload.data() as FirebaseGroceryListModel;
        // // Get document id
        const id = action.payload.id;
        // // Use spread operator to add the id to the document data
        return { id, ...data } as GroceryList;
      }));
  }

  // Get GroceryList
  getGroceryListByName = (name: string) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseGroceryListModel>('groceries',
      ref => ref.where('userId', '==', user.uid)
      .where('name', '==', name))
      .snapshotChanges()
      .pipe(map(actions => actions.map(action => {
        // Get document data
        const data = action.payload.doc.data() as FirebaseGroceryListModel;
        // // Get document id
        const id = action.payload.doc.id;
        // // Use spread operator to add the id to the document data
        return { id, ...data } as GroceryList;
      })));
  }

  // Update items in GroceryList
  addGroceryItem = (groceryId: string, item: string, list: string) => {
    const user = firebase.auth().currentUser;
    this.db.collection<FirebaseGroceryListModel>('groceries',
      ref => ref.where('userId', '==', user.uid))
      .doc(groceryId)
      .update({
        [list]: firebase.firestore.FieldValue.arrayUnion(item),
      });
  }

  // Update items in GroceryList
  removeGroceryItem = (groceryId: string, item: string, list: string) => {
    const user = firebase.auth().currentUser;
    this.db.collection<FirebaseGroceryListModel>('groceries',
      ref => ref.where('userId', '==', user.uid))
      .doc(groceryId)
      .update({
        [list]: firebase.firestore.FieldValue.arrayRemove(item),
      });
  }

  // TODO: Update GroceryList
  updateGroceryList = (groceryId: string, grocery: FirebaseGroceryListModel) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseGroceryListModel>('groceries',
      ref => ref.where('userId', '==', user.uid))
      .doc(groceryId).set(grocery);
  }

  // TODO: Delete GroceryList
  deleteGroceryList = (groceryId: string) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseGroceryListModel>('groceries',
      ref => ref.where('userId', '==', user.uid))
      .doc(groceryId).delete();
  }

  // SEARCH

  /* GET groceries whose keywords contains search term */
  searchGroceryLists(term: string): Observable<GroceryList[]> {
    const user = firebase.auth().currentUser;
    if (!term.trim()) {
      // if not search term, return empty grocery array.
      return of([]);
    }
    return this.db.collection('groceries', ref => ref.where('userId', '==', user.uid)
      .where('items', 'array-contains', term.toLowerCase().toString()))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data() as FirebaseGroceryListModel;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as GroceryList;
      })));
  }

  // searchGroceryLists(searchValue){
    // return this.db.collection('groceries',ref => ref.where('nameToSearch', '>=', searchValue)
    //   .where('nameToSearch', '<=', searchValue + '\uf8ff'))
    //   .snapshotChanges()
  // }

  // searchGroceryListsByAge(value){
  //   return this.db.collection('groceries',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  // }
}
