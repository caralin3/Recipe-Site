import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { Observable, Subscription } from 'rxjs';
import { externalEvents } from '../calendar/events';
import { RecipesService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-meals-list',
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals-list.component.scss']
})
export class MealsListComponent implements OnInit, OnDestroy {
  events: CalendarEvent[];
  recipes$: Observable<Recipe[]>;
  term: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.events = externalEvents;
    // Initial recipes
    this.recipes$ = this.recipesService.getLimitedRecipes(5);
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      if (params.keyword !== this.term) {
        this.term = params.keyword;
        if (this.term) {
          this.recipes$ = this.recipesService.searchRecipes(this.term);
        } else {
          this.recipes$ = this.recipesService.getLimitedRecipes(5);
        }
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  search(term: string): void {
    this.term = term;
  }

  onEnter = (term) => {
    this.search(term);
    this.router.navigate(['/recipes/search'], { queryParams: { keyword: term } });
    this.recipesService.searchRecipes(term);
  }

  externalDrop(event: CalendarEvent) {
    if (this.events.indexOf(event) === -1) {
      this.events.push(event);
    }
  }
}
