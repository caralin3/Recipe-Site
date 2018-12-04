import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipesService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-recipe-search-results',
  templateUrl: './recipe-search-results.component.html',
  styleUrls: ['./recipe-search-results.component.scss']
})
export class RecipeSearchResultsComponent implements OnInit {
  keyword: string;
  recipes$: Observable<Recipe[]>;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.keyword !== this.keyword) {
        this.keyword = params.keyword;
        if (this.keyword) {
          this.recipes$ = this.recipeService.searchRecipes(this.keyword);
        }
      }
    });
  }
}
