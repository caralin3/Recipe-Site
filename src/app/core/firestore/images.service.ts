import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Image } from '../models';
import { FirebaseImageModel } from './images.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private imagesCollection: AngularFirestoreCollection<{}>; 

  constructor(public db: AngularFirestore) {
    this.imagesCollection = db.collection<FirebaseImageModel>('images');
  }

  // Get All Images
  getImages = () => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseImageModel>('images',
      ref => ref.where('userId', '==', user.uid)).snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data() as FirebaseImageModel;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as Image;
      })
    ));
  }

  // Get Limited Images
  getLimitedImages = (limit: number) => {
    const images: Image[] = [];
    this.getImages().subscribe((img: Image[]) => {
      img.forEach((im, i) => {
        if (i < limit) {
          images.push(im);
        }
      });
    });
    return images;
  }

  getImageFromPath = (path: string) => {
    // let image: Image;
    return this.getImages().pipe(map(imgs =>
      imgs.map(img => {
        if (img.path === path) {
          return img;
        }
      })
    ))
    // this.getImages().subscribe((img: Image[]) => {
    //   img.forEach((im) => {
    //     if (im.path === path) {
    //       image = im;
    //     }
    //   });
    // });
    // return image;
  }

  // Get Image from Path
  getImageByPath = (path: string) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseImageModel>('images',
      ref => ref.where('userId', '==', user.uid)
      .where('path', '==', path))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data() as FirebaseImageModel;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as Image;
      })
    ));
  }

  // Create Image
  createImage = (image: FirebaseImageModel) => {
    return this.imagesCollection.add(image);
  }

  // Get Image
  getImage = (imageId: string) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseImageModel>('images',
      ref => ref.where('userId', '==', user.uid))
      .doc(imageId)
      .snapshotChanges()
      .pipe(map(action => {
        // Get document data
        const data = action.payload.data() as FirebaseImageModel;
        // // Get document id
        const id = action.payload.id;
        // // Use spread operator to add the id to the document data
        return { id, ...data } as Image;
      }));
  }

  // TODO: Update Image
  updateImage = (imageId: string, image: FirebaseImageModel) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseImageModel>('images',
      ref => ref.where('userId', '==', user.uid))
      .doc(imageId).set(image);
  }

  // TODO: Delete Image
  deleteImage = (imageId: string) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseImageModel>('images',
      ref => ref.where('userId', '==', user.uid))
      .doc(imageId).delete();
  }
}
