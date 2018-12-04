import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipesService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  @Input() comp: string;
  recipes$: Observable<Recipe[]>;
  term: string;

  constructor(
    private recipeService: RecipesService,
    private router: Router,
  ) {}

  ngOnInit() {}

  search(term: string): void {
    this.term = term;
  }

  onEnter = (term) => {
    this.search(term);
    if (this.comp === 'mealsList') {
      this.router.navigate(['/planner'], { queryParams: { keyword: term } });
    } else {
      this.router.navigate(['/recipes/search'], { queryParams: { keyword: term } });
    }
    this.recipeService.searchRecipes(term);
  }
}
