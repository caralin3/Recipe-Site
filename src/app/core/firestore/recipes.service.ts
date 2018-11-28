import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Recipe } from '../models';
import { FirebaseRecipeModel } from './recipes.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipesCollection: AngularFirestoreCollection<{}>; 

  constructor(public db: AngularFirestore) {
    this.recipesCollection = db.collection<FirebaseRecipeModel>('recipes');
  }

  // Get All Recipes
  getRecipes = (): Observable<Recipe[]> => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseRecipeModel>('recipes',
      ref => ref.where('userId', '==', user.uid)).snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data() as FirebaseRecipeModel;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as Recipe;
      })
    ));
  }

  // Get Limited Recipes
  getLimitRecipes = (limit: number): Observable<Recipe[]> => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseRecipeModel>('recipes',
      ref => ref.where('userId', '==', user.uid).limit(limit))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data() as FirebaseRecipeModel;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as Recipe;
      })
    ));
  }

  // Get Limited Recipes
  getLimitedRecipes = (limit: number) => {
    let recipes: Recipe[] = [];
    this.getRecipes().subscribe((rec: Recipe[]) => {
      rec.forEach((r, i) => {
        if (i < limit) {
          recipes.push(r);
        }
      });
    });
    return recipes;
  }

  // Get Recipes by Meal
  getRecipesByMeal = (meal: string) => {
    const recipes: Recipe[] = [];
    this.getRecipes().subscribe((rec: Recipe[]) => {
      rec.forEach((r) => {
        if (r.meals[meal]) {
          recipes.push(r);
        }
      });
    });
    return recipes;
  }

  // Create Recipe
  createRecipe = (recipe: FirebaseRecipeModel) => {
    return this.recipesCollection.add(recipe);
  }

  // Get Recipe
  getRecipe = (recipeId: string) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<FirebaseRecipeModel>('recipes',
      ref => ref.where('userId', '==', user.uid))
      .doc(recipeId)
      .snapshotChanges()
      .pipe(map(action => {
        // Get document data
        const data = action.payload.data() as FirebaseRecipeModel;
        // // Get document id
        const id = action.payload.id;
        // // Use spread operator to add the id to the document data
        return { id, ...data } as Recipe;
      }));
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

  // SEARCH

  /* GET recipes whose keywords contains search term */
  searchRecipes(term: string): Observable<Recipe[]> {
    const user = firebase.auth().currentUser;
    if (!term.trim()) {
      // if not search term, return empty recipe array.
      return of([]);
    }
    return this.db.collection('recipes', ref => ref.where('userId', '==', user.uid)
      .where('keywords', 'array-contains', term.toLowerCase().toString()))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data() as FirebaseRecipeModel;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as Recipe;
      })));
  }

  // searchRecipes(searchValue){
    // return this.db.collection('recipes',ref => ref.where('nameToSearch', '>=', searchValue)
    //   .where('nameToSearch', '<=', searchValue + '\uf8ff'))
    //   .snapshotChanges()
  // }

  // searchRecipesByAge(value){
  //   return this.db.collection('recipes',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  // }
}
