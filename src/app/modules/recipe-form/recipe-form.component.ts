import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RecipesService } from '../../../app/core/firestore';
import { ImportedRecipe, Recipe, User } from '../../../app/core/models';
import { FirebaseRecipeModel } from '../../../app/core/firestore/recipes.model';
import { AppState } from '../../../app/store';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Add Recipe';
  @Input() buttonText: string = 'Add';
  recipeForm: FormGroup;
  currentUser$: Observable<User>;
  importedRecipe$: Observable<ImportedRecipe>;
  editRecipe$: Observable<Recipe>;
  defaultRecipe: ImportedRecipe;
  currentUserId: string;
  stars: number;
  hover: number = 0;
  images: string[] = [];
  editId: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    public recipesService: RecipesService
  ) {
    this.currentUser$ = this.store.select(appState => appState.sessionState.currentUser);
    this.importedRecipe$ = this.store.select(appState => appState.sessionState.importedRecipe);
  }
  
  ngOnInit() {
    // Get current user id
    this.subscriptions.push(this.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    }));
    // Get edit recipe
    this.editRecipe$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.recipesService.getRecipe(id);
      })
    );
    // Get imported recipe
    this.subscriptions.push(this.importedRecipe$.subscribe(rec => {
      if (rec) {
        this.defaultRecipe = rec;
      } else {
        this.defaultRecipe = JSON.parse(localStorage.getItem('importedRecipe')) as ImportedRecipe;
      }
    }));
    this.createForm();
    this.onChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    document.removeEventListener('copy', () => {});
  }

  createForm() {
    if (this.location.path().includes('edit')) {
      const path = this.location.path().split('/');
      this.editId = path[path.length - 1];
      this.subscriptions.push(this.editRecipe$.subscribe(rec => {
        if (rec) {
          this.stars = rec.myRating;
          const meals: string[] = [];
          Object.entries(rec.meals).forEach(entry => {
            if (entry[1]) {
              meals.push(entry[0].toLowerCase().trim());
            }
          })
          this.recipeForm = this.fb.group({
            calories: [rec.calories, Validators.required ],
            cookTime: [rec.cookTime, Validators.required ],
            directions: [rec.directions.join('\n'), Validators.required ],
            ingredients: [rec.ingredients.join('\n'), Validators.required ],
            meals: [meals, Validators.required ],
            myRating: [rec.myRating, Validators.required ],
            notes: [rec.notes && rec.notes.join('\n')],
            prepTime: [rec.prepTime],
            src: [rec.src, Validators.required],
            tags: [rec.tags && rec.tags.join(',')],
            title: [rec.title, Validators.required ],
            totalTime: [rec.totalTime],
            url: [rec.url],
            yield: [rec.yield, Validators.required ],
          });
        }
      }));
    }
    if (this.defaultRecipe) {
      this.recipeForm = this.fb.group({
        calories: [this.defaultRecipe.calories, Validators.required ],
        cookTime: [this.defaultRecipe.cookTime, Validators.required ],
        directions: [this.defaultRecipe.directions.join('\n'), Validators.required ],
        ingredients: [this.defaultRecipe.ingredients.join('\n'), Validators.required ],
        meals: ['', Validators.required ],
        myRating: ['', Validators.required ],
        notes: [this.defaultRecipe.notes.join('\n')],
        prepTime: [this.defaultRecipe.prepTime],
        src: [this.defaultRecipe.src, Validators.required],
        tags: [''],
        title: [this.defaultRecipe.title, Validators.required ],
        totalTime: [this.defaultRecipe.totalTime],
        yield: [this.defaultRecipe.yield || this.defaultRecipe.servings, Validators.required ],
      });
    } else {
      this.recipeForm = this.fb.group({
        calories: ['', Validators.required ],
        cookTime: ['', Validators.required ],
        directions: ['', Validators.required ],
        ingredients: ['', Validators.required ],
        meals: ['', Validators.required ],
        myRating: ['', Validators.required ],
        notes: [''],
        prepTime: [''],
        src: ['', Validators.required],
        tags: [''],
        title: ['', Validators.required ],
        totalTime: [''],
        yield: ['', Validators.required ],
      });
    }
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
    this.subscriptions.push(this.recipeForm.get('myRating').valueChanges.subscribe(val => {
      this.stars = parseInt(val);
      this.hover = 0;
    }));
  }

  setStars = (num: number) => {
    if (this.editId) {
      this.stars = num;
      this.recipeForm.patchValue({
        myRating: num,
      });
      this.hover = 0;
    }
  }
  
  onHover = (num) => {
    this.hover = num;
  }

  onImageUpload = (path: string) => {
    this.images.push(path);
  }

  getKeywords = (recipe, meal) => {
    let keywords: string[] = [];
    const title: string[] = recipe.title.split(' ').map((i: string) => i !== '' && i.toLowerCase().trim());
    const tags: string[] = recipe.tags && recipe.tags.split(',').map((tag: string) => tag.toLowerCase().trim());
    const meals: string[] = [];
    Object.entries(meal).forEach(entry => {
      if (entry[1]) {
        meals.push(entry[0].toLowerCase().trim());
      }
    });
    keywords = keywords.concat(title);
    if (tags) {
      keywords = keywords.concat(tags);
    }
    keywords = keywords.concat(meals);
    return keywords;
  }

  addRecipe = (recipe, status) => {
    const valid = recipe.cookTime > 0 && recipe.yield >= 0 && recipe.calories > 0
      || (recipe.prepTime && recipe.prepTime >= 0) || (recipe.totalTime && recipe.totalTime >= 0);
    if (status === 'VALID' && valid) {
      const ingredients = recipe.ingredients.split('\n').map((i: string) => i !== '' && i.trim());
      const directions = recipe.directions.split('\n').map((d: string) => d !== '' && d.trim());
      const tags = recipe.tags && recipe.tags.split(',').map((tag: string) => tag.trim());
      const notes = recipe.notes && recipe.notes.split('\n').map((note: string) => note.trim());
      let url: string = '';
      if (this.defaultRecipe) {
        url = this.defaultRecipe.url;
      }
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
        images: this.images,
        ingredients,
        keywords,
        meals,
        notes,
        tags,
        totalTime,
        url,
        userId: this.currentUserId,
      }
      this.recipesService.createRecipe(newRecipe);
      this.recipeForm.reset();
      this.images = [];
      this.stars = undefined;
      localStorage.setItem('importedRecipe', null);
    }
  }

  editRecipe = (recipe, status) => {
    const valid = recipe.cookTime > 0 && recipe.yield >= 0 && recipe.calories > 0
      || (recipe.prepTime && recipe.prepTime >= 0) || (recipe.totalTime && recipe.totalTime >= 0);
    if (status === 'VALID' && valid) {
      const ingredients = recipe.ingredients.split('\n').map((i: string) => i !== '' && i.trim());
      const directions = recipe.directions.split('\n').map((d: string) => d !== '' && d.trim());
      const tags = recipe.tags && recipe.tags.split(',').map((tag: string) => tag.trim());
      let notes = recipe.notes && recipe.notes.split('\n').map((note: string) => note.trim());
      console.log(notes)
      let url = recipe.url;
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
        images: this.images,
        ingredients,
        keywords,
        meals,
        notes,
        tags,
        totalTime,
        url,
        userId: this.currentUserId,
      }
      this.recipesService.updateRecipe(this.editId, newRecipe);
      this.recipeForm.reset();
    }
  }
}
