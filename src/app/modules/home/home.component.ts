import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  login: boolean = false;
  showTop: boolean;

  constructor(private route: ActivatedRoute) {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.scrollY > 0) {
      this.showTop = true;
    } else {
      this.showTop = false;
    }
  }

  ngOnInit() {
    this.route.fragment.subscribe(f => {
      const element = document.querySelector("#" + f)
      if (element) element.scrollIntoView()
    });
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  toggleForm = () => {
    this.login = !this.login;
  }
}
