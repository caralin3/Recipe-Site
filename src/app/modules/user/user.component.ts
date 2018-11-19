import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FirebaseUserModel, UserService } from './';
import { AuthService } from '../../core/auth';
import { AppState } from '../../../app/store';
import { User } from '../../../app/core/models';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit {
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  currentUser: Observable<User>;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.currentUser = this.store.select(appState => appState.sessionState.currentUser);
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        this.createForm(this.user.name);
      }
    })
  }

  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }

  save(value){
    this.userService.updateCurrentUser(value)
    .then(res => {
      // console.log(res);
    }, err => console.log(err))
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }
}