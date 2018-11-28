import { Action } from '@ngrx/store';
import { User } from '../../core/models';

export const SET_USER = '[USER] Set';
export const SET_GROCERY_LISTS = '[GROCERY_LISTS] Set';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) {}
}

export class SetGroceryLists implements Action {
  readonly type = SET_GROCERY_LISTS;
  constructor(public payload: {id: string; name: string}[]) {}
}

export type Actions = SetUser | SetGroceryLists;
