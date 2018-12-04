import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ImportedRecipe, User } from '../../../app/core/models';
import { AppState } from '../../../app/store';
import * as SessionActions from '../../../app/store/session/session.actions';

@Component({
  selector: 'app-recipe-import',
  templateUrl: './recipe-import.component.html',
  styleUrls: ['./recipe-import.component.scss']
})
export class RecipeImportComponent implements OnInit, OnDestroy {
  importForm: FormGroup;
  currentUser: Observable<User>;
  currentUserId: string;
  errorMessage: string;
  sites = [
    {name: 'AllRecipes', link: 'https://www.allrecipes.com'},
    {name: 'Genius Kitchen', link: 'https://www.geniuskitchen.com'},
    {name: 'Food & Wine', link: 'https://www.foodandwine.com'},
    {name: 'Food Network', link: 'https://www.foodnetwork.com'},
    {name: 'The Kitchn', link: 'https://www.thekitchn.com'},
  ]

  private subscriptions: Subscription[] = [];
  
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private store: Store<AppState>,

  ) {
    this.currentUser = this.store.select(appState => appState.sessionState.currentUser);
  }

  ngOnInit() {
    this.subscriptions.push(this.currentUser.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    }));
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm() {
    this.importForm = this.fb.group({
      url: ['', Validators.required ],
    });
  }

  getUrl = (importForm, status) => {
    if (status === 'VALID') {
      this.importRecipe(importForm.url);
    }
  }

  importRecipe = async (url: string) => {
    const API_URL = 'https://recipemine-api.herokuapp.com'
    const fetchUrl = `${API_URL}?url=${url}`
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        console.error(`Error ${response.status}`);
      }
      const data: ImportedRecipe = await response.json();
      this.store.dispatch(new SessionActions.SetImportedRecipe(data));
      localStorage.setItem('importedRecipe', JSON.stringify(data));
      if (this.location.path().includes('demo')) {
        this.router.navigate(['/home/demo/add']);
      } else {
        this.router.navigate(['/recipes/add']);
      }
    } catch (err) {
       this.errorMessage = err.message;
    }
  }
}
