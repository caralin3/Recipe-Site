import { Action } from '@ngrx/store';
import { User } from '../../core/models';
import * as SessionActions from './session.actions';

export interface SessionState {
  currentUser: User | null;
}

const initialState: SessionState = {
  currentUser: null,
}

export const reducer = (state: SessionState = initialState, action: SessionActions.Actions) => {
  switch(action.type) {
    case SessionActions.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
      }
    default:
      return state;
  }
}
