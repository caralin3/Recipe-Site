import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard, AuthService } from './core/auth'
import { GroceriesService, ImagesService, FirebaseUserService, RecipesService } from './core/firestore';
import { UserResolver } from './core/user.resolver';
import { DropZoneDirective, FullscreenDirective } from './directives';
import {
  ContactComponent,
  FileUploadComponent,
  GroceryComponent,
  HomeComponent,
  ImageCarouselComponent,
  LoginComponent,
  NavbarComponent,
  PlannerComponent,
  RecipeDetailComponent,
  RecipeFormComponent,
  RecipeImportComponent,
  RecipesComponent,
  RecipesItemComponent,
  RecipeSearchComponent,
  RecipeSearchResultsComponent,
  RegisterComponent
} from './modules';
import { UserService } from './modules/user';
import { UserComponent } from './modules/user/user.component';
import { FileSizePipe, NumberToLabelPipe, TrimTextPipe } from './pipes';
import { reducer as sessionReducer } from './store/session/session.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    FullscreenDirective,
    GroceryComponent,
    HomeComponent,
    ImageCarouselComponent,
    LoginComponent,
    NavbarComponent,
    NumberToLabelPipe,
    PlannerComponent,
    RecipeDetailComponent,
    RecipeFormComponent,
    RecipeImportComponent,
    RecipesComponent,
    RecipesItemComponent,
    RecipeSearchComponent,
    RecipeSearchResultsComponent,
    RegisterComponent,
    UserComponent,
    TrimTextPipe,
    DropZoneDirective,
    FileUploadComponent,
    FileSizePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFirestoreModule.enablePersistence(), // Offline data
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forRoot({
      sessionState: sessionReducer,
    })
  ],
  providers: [AuthGuard, AuthService, GroceriesService, ImagesService, RecipesService, UserResolver, UserService, FirebaseUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
