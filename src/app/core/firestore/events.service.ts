import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private eventsCollection: AngularFirestoreCollection<{}>; 

  constructor(public db: AngularFirestore) {
    this.eventsCollection = db.collection<CalendarEvent<{recipe: Recipe}>>('events');
  }

  // Get All Eventss
  getEvents = (): Observable<CalendarEvent<{recipe: Recipe}>[]> => {
    const user = firebase.auth().currentUser;
    return this.db.collection<CalendarEvent<{recipe: Recipe}>>('events',
      ref => ref.where('meta.recipe.userId', '==', user.uid))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        // Get document data
        const data = a.payload.doc.data();
        data.start = new Date(data.start);
        if (data.end) {
          data.end = new Date(data.end);
        }
        const actions: CalendarEventAction[] = [
          {
            label: '<i class="far fa-trash-alt"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.deleteEvent(event.id as string);
            }
          }
        ];
        data.actions = actions;
        // Get document id
        const id = a.payload.doc.id;
        // Use spread operator to add the id to the document data
        return { id, ...data } as CalendarEvent<{recipe: Recipe}>;
      })
    ));
  }

  // Create Event
  createEvent = (event: CalendarEvent<{recipe: Recipe}>) => {
    const newEvent = {
      ...event,
      start: event.start.toLocaleString(),
      end: event.end && event.end.toLocaleString(),
    }
    this.eventsCollection.add(newEvent);
  }

  // Update Event
  updateEvent = (eventId: string, event: CalendarEvent<{recipe: Recipe}>) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<CalendarEvent<{recipe: Recipe}>>('events',
      ref => ref.where('meta.recipe.userId', '==', user.uid))
      .doc(eventId)
      .set({
        ...event,
        start: event.start.toLocaleString(),
        end: event.end && event.end.toLocaleString(),
      });
  }

  // TODO: Delete Events
  deleteEvent = (eventId: string) => {
    const user = firebase.auth().currentUser;
    return this.db.collection<CalendarEvent<{recipe: Recipe}>>('events',
      ref => ref.where('meta.recipe.userId', '==', user.uid))
      .doc(eventId).delete();
  }

  // SEARCH

  /* GET events whose keywords contains search term */
  // searchEvents(term: string): Observable<CalendarEvent<{recipe: Recipe}>[]> {
  //   const user = firebase.auth().currentUser;
  //   if (!term.trim()) {
  //     // if not search term, return empty event array.
  //     return of([]);
  //   }
  //   return this.db.collection('events', ref => ref.where('meta.recipe.userId', '==', user.uid)
  //     .where('items', 'array-contains', term.toLowerCase().toString()))
  //     .snapshotChanges()
  //     .pipe(map(actions => actions.map(a => {
  //       // Get document data
  //       const data = a.payload.doc.data();
  //       // Get document id
  //       const docId = a.payload.doc.id;
  //       // Use spread operator to add the id to the document data
  //       return { docId, ...data };
  //     })));
  // }

  // searchEvents(searchValue){
    // return this.db.collection('events',ref => ref.where('nameToSearch', '>=', searchValue)
    //   .where('nameToSearch', '<=', searchValue + '\uf8ff'))
    //   .snapshotChanges()
  // }

  // searchEventsByAge(value){
  //   return this.db.collection('events',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  // }
}
