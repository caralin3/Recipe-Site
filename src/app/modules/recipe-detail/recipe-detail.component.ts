import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ImagesService, RecipesService } from '../../../app/core/firestore';
import { Image, Recipe } from '../../../app/core/models';
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
  images: Observable<Image>[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private imagesService: ImagesService,
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
    const imgs = [];
    const pathImgs = [];
    this.recipeFromParam.subscribe(r => {
      this.recipe = r;
      if (this.recipe.images && this.recipe.images.length > 0) {
        this.recipe.images.forEach(path => {
          imgs.push(this.imagesService.getImageByPath(path));
          const img = this.imagesService.getImageFromPath(path)
            .subscribe(obs => {console.log(obs)})
          console.log(img);
          pathImgs.push(img);
          
          console.log(pathImgs)
          // this.images = this.imagesService.getImageByPath(path);
          this.images = imgs;
          // console.log(this.images);
        });
      }
      // console.log(pathImgs.map(d => [].concat(...d)))
      // pathImgs.forEach(img => console.log(img))
      // const igs = []
      // imgs.forEach(img => img.subscribe(i => this.images.push(i[0])));
      // console.log(this.images);
    });
    
    // console.log(this.images);
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
