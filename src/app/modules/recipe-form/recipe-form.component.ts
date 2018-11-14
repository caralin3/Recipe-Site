import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RecipesService } from '../../../app/core/firestore';
import { User } from '../../../app/core/models';
import { FirebaseRecipeModel } from '../../../app/core/firestore/recipes.model';
import { AppState } from '../../../app/store';

@Component({
  selector: 'recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  currentUser: Observable<User>;
  currentUserId: string;
  innerWidth: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public recipesService: RecipesService
  ) {
    this.currentUser = this.store.select(appState => appState.sessionState.currentUser);
  }
  
  ngOnInit() {
    this.createForm();
    this.innerWidth = window.innerWidth;
    this.currentUser.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
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

  addRecipe = (recipe, status) => {
    if (status === 'VALID') {
      const ingredients = recipe.ingredients.split('\n').map((i: string) => i.trim());
      const directions = recipe.directions.split('\n').map((d: string) => d.trim());
      const tags = recipe.tags.split(',').map((tag: string) => tag.trim());
      const newRecipe: FirebaseRecipeModel = {
        ...recipe,
        directions,
        ingredients,
        tags,
        userId: this.currentUserId,
      }
      console.log(newRecipe);
      this.recipesService.createRecipe(newRecipe);
    }
  }

}
