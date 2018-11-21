import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard, AuthService } from './core/auth'
import { FirebaseUserService, RecipesService } from './core/firestore';
import { UserResolver } from './core/user.resolver';
import {
  ContactComponent,
  GroceryComponent,
  HomeComponent,
  ImageCarouselComponent,
  LoginComponent,
  NavbarComponent,
  PlannerComponent,
  RecipeDetailComponent,
  RecipeFormComponent,
  RecipesComponent,
  RecipesItemComponent,
  RegisterComponent
} from './modules';
import { UserService } from './modules/user';
import { UserComponent } from './modules/user/user.component';
import { NumberToLabelPipe, TrimTextPipe } from './pipes';
import { reducer as sessionReducer } from './store/session/session.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    GroceryComponent,
    HomeComponent,
    ImageCarouselComponent,
    LoginComponent,
    NavbarComponent,
    NumberToLabelPipe,
    PlannerComponent,
    RecipeDetailComponent,
    RecipeFormComponent,
    RecipesComponent,
    RecipesItemComponent,
    RegisterComponent,
    UserComponent,
    TrimTextPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFirestoreModule.enablePersistence(), // Offline data
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forRoot({
      sessionState: sessionReducer,
    })
  ],
  providers: [AuthGuard, AuthService, RecipesService, UserResolver, UserService, FirebaseUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
