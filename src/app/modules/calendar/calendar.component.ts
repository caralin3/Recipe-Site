import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter,
  CalendarEventTitleFormatter
} from 'angular-calendar';
import { Observable, Subject, Subscription } from 'rxjs';
import { EventsService } from '../../../app/core/firestore';
import { User, Recipe } from '../../../app/core/models';
import { Router } from '@angular/router';
import { CustomDateFormatter, CustomEventTitleFormatter } from '../../../app/providers';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  CalendarView = CalendarView;
  view = CalendarView.Week;
  viewDate = new Date();
  activeDayIsOpen = false;
  refresh = new Subject<void>();
  events$: Observable<CalendarEvent<{recipe: Recipe}>[]>;
  currentUser$: Observable<User>;
  currentUserId: string;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private router: Router,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.fetchEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchEvents = () => {
    this.events$ = this.eventsService.getEvents();
  }

  dayClicked(date: Date) {
    this.viewDate = date;
    this.activeDayIsOpen = !this.activeDayIsOpen;
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    this.router.navigate(['/recipes/', event.meta.recipe.id]);
  }

  eventDropped({
    event,
    newStart,
    newEnd,
    allDay
  }: CalendarEventTimesChangedEvent): void {
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    event.start = newStart;
    let end = new Date(newStart);
    end.setMinutes(end.getMinutes() + event.meta.recipe.totalTime);
    if (!event.meta.recipe.totalTime) {
      end.setMinutes(end.getMinutes() + event.meta.recipe.cookTime)
    }
    if (newEnd) {
      event.end = newEnd;
    } else {
      event.end = end;
    }

    if (event.id) {
      this.eventsService.updateEvent(event.id as string, event);
    } else {
      this.eventsService.createEvent(event);
    }

    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
  }
}
