import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipesService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  recipes: Observable<Recipe[]>;

  constructor(
    public recipesService: RecipesService
  ) {
  }

  ngOnInit() {
    this.recipes = this.recipesService.getRecipes();
  }
}
