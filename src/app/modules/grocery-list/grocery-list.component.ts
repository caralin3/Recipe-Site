import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GroceriesService } from '../../../app/core/firestore';
import { GroceryList } from 'src/app/core/models';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent implements OnInit {
  @Input() lst: {id: string, name: string};
  groceryLists$: Observable<{id: string, name: string}[]>;
  groceries$: Observable<GroceryList>;
  completed: string[] = [];
  id: string;
  adding: boolean;
  newItem: string;
  private subscriptions: Subscription[] = [];

  constructor(public groceriesService: GroceriesService) {}

  ngOnInit() {
    this.groceries$ = this.groceriesService.getGroceryList(this.lst.id);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleAdd = () => {
    this.adding = !this.adding;
  }

  addItem = (item: string) => {
    const newItem = item.toLowerCase().trim();
    if (newItem) {
      this.groceriesService.addGroceryItem(this.lst.id, newItem, 'items');
    }
    this.adding = false;
  }

  check = (item: string) => {
    const dup = this.completed.indexOf(item);
    if (dup > -1) {
      this.completed.splice(dup, 1);
      this.groceriesService.addGroceryItem(this.lst.id, item, 'items');
      this.groceriesService.removeGroceryItem(this.lst.id, item, 'completed');
    } else {
      this.completed.push(item);
      this.groceriesService.addGroceryItem(this.lst.id, item, 'completed');
      this.groceriesService.removeGroceryItem(this.lst.id, item, 'items');
    }
  }

  clear = (item: string) => {
    this.groceriesService.removeGroceryItem(this.lst.id, item, 'completed');
  }

  removeList = () => {
    this.groceriesService.deleteGroceryList(this.lst.id);
  }
}
