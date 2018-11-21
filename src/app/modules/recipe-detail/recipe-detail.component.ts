import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RecipesService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipeFromParam: Observable<Recipe>;
  recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    public recipesService: RecipesService
  ) { }

  ngOnInit() {
    this.recipeFromParam = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.recipesService.getRecipe(id);
      })
    );
    this.recipeFromParam.subscribe(r => this.recipe = r);
  }

}
