import { ImportedRecipe, User } from '../../core/models';
import * as SessionActions from './session.actions';

export interface SessionState {
  currentUser: User | null;
  importedRecipe: ImportedRecipe,
  groceryLists: {id: string; name: string}[];
}

const initialState: SessionState = {
  currentUser: null,
  importedRecipe: null,
  groceryLists: [],
}

export function reducer (state: SessionState = initialState, action: SessionActions.Actions) {
  switch(action.type) {
    case SessionActions.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
      }
    case SessionActions.SET_IMPORTED_RECIPE:
      return {
        ...state,
        importedRecipe: action.payload,
      }
    case SessionActions.SET_GROCERY_LISTS:
      return {
        ...state,
        groceryLists: action.payload,
      }
    default:
      return state;
  }
}
