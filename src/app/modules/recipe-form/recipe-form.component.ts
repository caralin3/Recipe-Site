import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RecipesService } from '../../../app/core/firestore';
import { User } from '../../../app/core/models';
import { FirebaseRecipeModel } from '../../../app/core/firestore/recipes.model';
import { AppState } from '../../../app/store';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  currentUser: Observable<User>;
  currentUserId: string;
  stars: number;
  hover: number = 0;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public recipesService: RecipesService
  ) {
    this.currentUser = this.store.select(appState => appState.sessionState.currentUser);
  }
  
  ngOnInit() {
    this.createForm();
    this.currentUser.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
    this.onChanges();
  }

  createForm() {
    this.recipeForm = this.fb.group({
      calories: ['', Validators.required ],
      cookTime: ['', Validators.required ],
      directions: ['', Validators.required ],
      ingredients: ['', Validators.required ],
      meals: ['', Validators.required ],
      myRating: ['', Validators.required ],
      notes: [''],
      prepTime: [''],
      tags: [''],
      title: ['', Validators.required ],
      totalTime: [''],
      yield: ['', Validators.required ],
    });
  }

  copyIngredients = (recipe) => {
    const ingredients = recipe.ingredients;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (ingredients));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  onChanges = () => {
    this.recipeForm.get('myRating').valueChanges.subscribe(val => {
      this.stars = parseInt(val);
      this.hover = 0;
    });
  }
  
  onHover = (num) => {
    this.hover = num;
  }

  getKeywords = (recipe, meal) => {
    let keywords: string[] = [];
    const title: string[] = recipe.title.split(' ').map((i: string) => i !== '' && i.toLowerCase().trim());
    const notes: string[] = recipe.notes && recipe.notes.split(',').map((i: string) => i !== '' && i.toLowerCase().trim());
    const tags: string[] = recipe.tags && recipe.tags.split(',').map((tag: string) => tag.toLowerCase().trim());
    const meals: string[] = [];
    Object.entries(meal).forEach(entry => {
      if (entry[1]) {
        meals.push(entry[0].toLowerCase().trim());
      }
    });
    keywords = keywords.concat(title);
    if (notes) {
      keywords = keywords.concat(notes);
    }
    if (tags) {
      keywords = keywords.concat(tags);
    }
    keywords = keywords.concat(meals);
    return keywords;
  }

  addRecipe = (recipe, status) => {
    if (status === 'VALID') {
      const ingredients = recipe.ingredients.split('\n').map((i: string) => i !== '' && i.trim());
      const directions = recipe.directions.split('\n').map((d: string) => d !== '' && d.trim());
      const tags = recipe.tags && recipe.tags.split(',').map((tag: string) => tag.trim());
      const notes = recipe.notes && recipe.notes.split(',').map((note: string) => note.trim());
      let meals = {
        'breakfast': false,
        'lunch': false,
        'dinner': false,
        'snack': false,
        'side': false,
        'appetizer': false,
        'dessert': false,
      };
      recipe.meals.forEach((meal) => {
        meals = {
          ...meals,
          [meal]: true,
        }
      })
      let totalTime = recipe.totalTime;
      if (!totalTime || totalTime === 0) {
        totalTime += recipe.cookTime + recipe.prepTime;
      }

      const keywords = this.getKeywords(recipe, meals);

      const newRecipe: FirebaseRecipeModel = {
        ...recipe,
        directions,
        ingredients,
        keywords,
        meals,
        notes,
        tags,
        totalTime,
        userId: this.currentUserId,
      }
      this.recipesService.createRecipe(newRecipe);
      this.recipeForm.reset();
      this.stars = undefined;
    }
  }
}
