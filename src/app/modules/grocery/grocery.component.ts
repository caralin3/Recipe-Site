import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GroceriesService } from '../../../app/core/firestore';
import { GroceryList } from 'src/app/core/models';

@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.scss']
})
export class GroceryComponent implements OnInit, OnDestroy {
  groceryLists$: Observable<GroceryList[]>;
  lists: {id: string, name: string}[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    public groceriesService: GroceriesService,
  ) {
    this.groceryLists$ = this.groceriesService.getGroceryLists();
  }

  ngOnInit() {
    this.getDefaultList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getDefaultList = () => {
    let temp: Subscription = this.groceryLists$
      .subscribe(lists => lists.forEach(list => {
        temp.unsubscribe();
        const id = list.id;
        const name = list.name;
        if (name === 'Groceries') {
          this.lists.unshift({id, name});
        } else {
          this.lists.push({id, name});
        }
      }));
  }
}
