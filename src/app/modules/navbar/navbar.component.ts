import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { User } from '../../../app/core/models';
import { AppState } from '../../../app/store';
import { AuthService } from '../../core/auth';
import * as SessionActions from '../../store/session/session.actions';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  authUser: User;
  innerWidth: number;
  mobile: boolean = false;
  showMenu: boolean = false;
  fullscreen: boolean;

  constructor(
    public authService: AuthService,
    private location: Location,
    private store: Store<AppState>
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1000) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  ngOnInit() {
    if (screenfull.enabled) {
      screenfull.on('change', () => {
        this.fullscreen = screenfull.isFullscreen;
      });
    }
    this.store.select(appState => appState.sessionState.currentUser)
      .subscribe((user: User) => this.authUser = user);
    this.onResize();
  }

  toggleMenu = () => {
    this.showMenu = !this.showMenu;
  }

  logout = () => {
    this.authService.doLogout()
    .then((res) => {
      this.store.dispatch(new SessionActions.SetUser(null));
      this.location.back();
      this.toggleMenu();
    }, (error) => {
      console.log("Logout error", error);
    });
  }

}
