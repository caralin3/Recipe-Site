import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard, AuthService, FirebaseUserService } from './core';
import { LoginComponent } from './modules';
import { RegisterComponent } from './modules';
import { UserResolver, UserService } from './modules/user';
import { UserComponent } from './modules/user/user.component';
import { reducer as sessionReducer } from './store/session/session.reducer';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      sessionState: sessionReducer,
    })
  ],
  providers: [AuthGuard, AuthService, UserResolver, UserService, FirebaseUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
