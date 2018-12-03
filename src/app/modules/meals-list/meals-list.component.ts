import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { externalEvents } from '../calendar/events';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/core/models';
import { RecipesService } from 'src/app/core/firestore';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meals-list',
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals-list.component.scss']
})
export class MealsListComponent implements OnInit {
  events: CalendarEvent[];
  recipes$: Observable<Recipe[]>;
  term: string;

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.events = externalEvents;
    this.route.queryParams.subscribe(params => {
      if (params.keyword !== this.term) {
        this.term = params.keyword;
        if (this.term) {
          this.recipes$ = this.recipeService.searchRecipes(this.term);
        }
      }
    });
  }

  search(term: string): void {
    this.term = term;
  }

  onEnter = (term) => {
    this.search(term);
    this.router.navigate(['/recipes/search'], { queryParams: { keyword: term } });
    this.recipeService.searchRecipes(term);
  }

  externalDrop(event: CalendarEvent) {
    if (this.events.indexOf(event) === -1) {
      this.events.push(event);
    }
  }

}
