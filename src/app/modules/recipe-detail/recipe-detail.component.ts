import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as screenfull from 'screenfull';
import { RecipesService } from '../../../app/core/firestore';
import { Image, Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  images$: Observable<Image[]>;
  images: Image[] = [];
  recipeFromParam$: Observable<Recipe>;
  recipe: Recipe;
  checked: string[] = [];
  limitedRecipes: Observable<Recipe[]>;
  fullscreen: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public recipesService: RecipesService
  ) { }

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
    this.subscriptions.push(this.recipeFromParam$.subscribe(rec => {
      this.recipe = rec;
    }));
    this.limitedRecipes = this.recipesService.getLimitedRecipes(4);
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
}
