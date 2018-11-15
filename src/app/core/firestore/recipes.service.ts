import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Recipe } from '../models';
import { FirebaseRecipeModel } from './recipes.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipesCollection: AngularFirestoreCollection<{}>; 

  constructor(public db: AngularFirestore) {
    this.recipesCollection = db.collection<FirebaseRecipeModel>('recipes');
  }

    // Get All Recipes
    getRecipes = () => {
      const user = firebase.auth().currentUser;
      return this.db.collection<FirebaseRecipeModel>('recipes',
        ref => ref.where('userId', '==', user.uid)).snapshotChanges()
        .pipe(map(actions => actions.map(a => {
          //Get document data
          const data = a.payload.doc.data() as FirebaseRecipeModel;
          //Get document id
          const id = a.payload.doc.id;
          //Use spread operator to add the id to the document data
          return { id, ...data } as Recipe;
        })
      ));
    }

    // Create Recipe
    createRecipe = (recipe: FirebaseRecipeModel) => {
      return this.recipesCollection.add(recipe);
    }

    // TODO: Get Recipe
    getRecipe = (recipeId: string) => {
      const user = firebase.auth().currentUser;
      return this.db.collection<FirebaseRecipeModel>('recipes',
        ref => ref.where('userId', '==', user.uid))
        .doc(recipeId).snapshotChanges();
    }

    // TODO: Update Recipe
    updateRecipe = (recipeId: string, recipe: FirebaseRecipeModel) => {
      const user = firebase.auth().currentUser;
      return this.db.collection<FirebaseRecipeModel>('recipes',
        ref => ref.where('userId', '==', user.uid))
        .doc(recipeId).set(recipe);
    }

    // TODO: Delete Recipe
    deleteRecipe = (recipeId: string) => {
      const user = firebase.auth().currentUser;
      return this.db.collection<FirebaseRecipeModel>('recipes',
        ref => ref.where('userId', '==', user.uid))
        .doc(recipeId).delete();
    }

    // searchRecipes(searchValue){
    //   return this.db.collection('recipes',ref => ref.where('nameToSearch', '>=', searchValue)
    //     .where('nameToSearch', '<=', searchValue + '\uf8ff'))
    //     .snapshotChanges()
    // }

    // searchRecipesByAge(value){
    //   return this.db.collection('recipes',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
    // }
}
