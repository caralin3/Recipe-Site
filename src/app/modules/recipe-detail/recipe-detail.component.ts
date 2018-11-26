import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RecipesService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipeFromParam: Observable<Recipe>;
  recipe: Recipe;
  checked: string[] = [];
  limitedRecipes: Recipe[];
  fullscreen: boolean;

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
    this.recipeFromParam = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.recipesService.getRecipe(id);
      })
    );
    this.recipeFromParam.subscribe(r => this.recipe = r);
    this.limitedRecipes = this.recipesService.getLimitedRecipes(4);
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
