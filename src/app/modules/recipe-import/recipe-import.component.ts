import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models';

@Component({
  selector: 'app-recipe-import',
  templateUrl: './recipe-import.component.html',
  styleUrls: ['./recipe-import.component.scss']
})
export class RecipeImportComponent implements OnInit {
  importForm: FormGroup;
  currentUser: Observable<User>;
  currentUserId: string;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,

  ) {
    this.currentUser = this.store.select(appState => appState.sessionState.currentUser);
  }

  ngOnInit() {
    this.currentUser.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
    this.createForm();
  }

  createForm() {
    this.importForm = this.fb.group({
      url: ['', Validators.required ],
    });
  }

  importRecipe = (importForm, status) => {
    if (status === 'VALID') {
      console.log(importForm.url)
    }
  }
}
