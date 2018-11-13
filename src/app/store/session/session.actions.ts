import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { User } from '../../core/models';

export const SET_USER = '[USER] Set';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) {}
}

export type Actions = SetUser;
