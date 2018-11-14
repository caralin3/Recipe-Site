import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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
      return this.recipesCollection.snapshotChanges();
    }

    // Create Recipe
    createRecipe = (recipe: FirebaseRecipeModel) => {
      return this.recipesCollection.add(recipe);
    }

    // TODO: Get Recipe
    getRecipe = (recipeId: string) => {
      return this.recipesCollection.doc(recipeId).snapshotChanges();
    }

    // TODO: Update Recipe
    updateRecipe = (recipeId: string, recipe: FirebaseRecipeModel) => {
      return this.recipesCollection.doc(recipeId).set(recipe);
    }

    // TODO: Delete Recipe
    deleteRecipe = (recipeId: string) => {
      return this.recipesCollection.doc(recipeId).delete();
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
