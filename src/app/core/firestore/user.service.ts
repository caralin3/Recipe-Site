import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirebaseUserModel } from './user.model';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<{}>; 

  constructor(public db: AngularFirestore) {
    this.usersCollection = db.collection<FirebaseUserModel>('users');
  }

  // Get All Users
  getUsers = () => {
    return this.usersCollection.snapshotChanges();
  }

  // Create User
  createUser = (user: User) => {
    return this.usersCollection.doc(user.id).set({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    } as FirebaseUserModel);
  }

  // TODO: Get User
  getUser = (userId: string) => {
    return this.usersCollection.doc(userId).snapshotChanges();
  }

  // TODO: Update User
  updateUser = (userId: string, user: FirebaseUserModel) => {
    return this.usersCollection.doc(userId).set(user);
  }

  // TODO: Delete User
  deleteUser = (userId: string) => {
    return this.usersCollection.doc(userId).delete();
  }

  // searchUsers(searchValue){
  //   return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
  //     .where('nameToSearch', '<=', searchValue + '\uf8ff'))
  //     .snapshotChanges()
  // }

  // searchUsersByAge(value){
  //   return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  // }
}
