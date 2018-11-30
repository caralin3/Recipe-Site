import { Action } from '@ngrx/store';
import { ImportedRecipe, User } from '../../core/models';

export const SET_USER = '[USER] Set';
export const SET_IMPORTED_RECIPE = '[IMPORTED RECIPE] Set';
export const SET_GROCERY_LISTS = '[GROCERY_LISTS] Set';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) {}
}

export class SetImportedRecipe implements Action {
  readonly type = SET_IMPORTED_RECIPE;
  constructor(public payload: ImportedRecipe) {}
}

export class SetGroceryLists implements Action {
  readonly type = SET_GROCERY_LISTS;
  constructor(public payload: {id: string; name: string}[]) {}
}

export type Actions = SetUser | SetImportedRecipe | SetGroceryLists;
