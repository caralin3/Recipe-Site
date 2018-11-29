import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as screenfull from 'screenfull';
import { RecipesService, GroceriesService } from '../../../app/core/firestore';
import { Image, Recipe } from '../../../app/core/models';
import { AppState } from '../../../app/store';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  images$: Observable<Image[]>;
  images: Image[] = [];
  recipeFromParam$: Observable<Recipe>;
  limitedRecipes$: Observable<Recipe[]>;
  groceryLists$: Observable<{id: string, name: string}[]>;
  recipe: Recipe;
  checked: string[] = [];
  inGroceries: object;
  fullscreen: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    public groceriesService: GroceriesService,
    public recipesService: RecipesService
  ) {
    this.groceryLists$ = this.store.select(appState => appState.sessionState.groceryLists);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.scrollY === 0) {
      this.location.go(this.location.path());
    }
  }

  ngOnInit() {
    if (screenfull.enabled) {
      screenfull.on('change', () => {
        this.fullscreen = screenfull.isFullscreen;
      });
    }
    this.route.fragment.subscribe(f => {
      const element = document.querySelector("#" + f)
      if (element) element.scrollIntoView()
    });
    this.recipeFromParam$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.recipesService.getRecipe(id);
      })
    );
    this.limitedRecipes$ = this.recipesService.getLimitedRecipes(4);
    this.setGroceryItems();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  check = (direction: string, index: number) => {
    const dup = this.checked.indexOf(direction);
    if (dup > -1) {
      this.checked.splice(dup, 1);
    } else {
      this.checked.push(direction);
    }
  }

  setGroceryItems = () => {
    this.subscriptions.push(this.recipeFromParam$.subscribe(rec => {
      this.recipe = rec;
      this.subscriptions.push(this.groceryLists$
        .subscribe(lists => lists.forEach(list => {
          const id = list.id;
          const name = list.name;
          if (name === 'Groceries') {
            const groceries = this.groceriesService.getGroceryList(id);
            this.recipe.ingredients.forEach(ing => {
              const ingred = ing.toLowerCase().trim();
              this.inGroceries = {
                ...this.inGroceries,
                [ingred]: false,
              }
              this.subscriptions.push(groceries.subscribe(groc => {
                this.inGroceries = {
                  ...this.inGroceries,
                  [ingred]: groc.items.includes(ingred),
                }
              }));
            });
          }
        }))
      );
    }));
  }

  addIngredient = (ingred: string) => {
    const newIng = ingred.toLowerCase().trim();
    this.subscriptions.push(this.groceryLists$
      .subscribe(lists => lists.forEach(list => {
        const id = list.id;
        const name = list.name;
        if (name === 'Groceries') {
          this.groceriesService.addGroceryItem(id, newIng, 'items');
        }
      }))
    );
  } 
}
