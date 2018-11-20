import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipesService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  showTop: boolean;
  recipes: Observable<Recipe[]>;
  mealRecipes: Recipe[];
  greeting: string;

  constructor(
    public recipesService: RecipesService
  ) {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.scrollY > 0) {
      this.showTop = true;
    } else {
      this.showTop = false;
    }
  }

  ngOnInit() {
    this.recipes = this.recipesService.getRecipes();
    this.setGreeting();
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  }
  
  setGreeting = () => {
    const hour = new Date().getHours();
    if (hour > 11 && hour <= 15) {
      this.mealRecipes = this.recipesService.getRecipesByMeal('lunch');
      this.greeting = "Good Afternoon! Check out these lunch recipes";
    } else if (hour > 15) {
      this.mealRecipes = this.recipesService.getRecipesByMeal('dinner');
      this.greeting = "Good Evening! Check out these dinner recipes";
    } else if (hour <= 11 ) {
      this.mealRecipes = this.recipesService.getRecipesByMeal('breakfast');
      this.greeting = "Good Morning! Check out these breakfast recipes";
    } else {
      this.greeting = "Check out these recipes";
    }
  }
}
