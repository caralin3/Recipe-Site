import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { Observable, Subscription } from 'rxjs';
import { RecipesService, EventsService } from '../../../app/core/firestore';
import { Recipe } from '../../../app/core/models';

@Component({
  selector: 'app-meals-list',
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals-list.component.scss']
})
export class MealsListComponent implements OnInit, OnDestroy {
  recipes$: Observable<Recipe[]>;
  event: CalendarEvent<{recipe: Recipe}>;
  term: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private eventsService: EventsService,
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.event = {
      color: {
        primary: '#E27241',
        secondary: '#F9DDD1'
      },
      start: new Date(),
      title: 'New Event',
      draggable: true,
    }
  }

  ngOnInit() {
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

  setEvent = (data: {event: CalendarEvent, recipe: Recipe}) => {
    this.event = {
      ...data.event,
      title: data.recipe.title,
      meta: {
        recipe: data.recipe
      }
    }
  }
}
