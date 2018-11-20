import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  login: boolean = false;
  showTop: boolean;
  image: string;

  constructor(private location: Location, private route: ActivatedRoute) {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.scrollY > 0) {
      this.showTop = true;
    } else {
      this.showTop = false;
      this.location.go('/home');
    }
  }

  ngOnInit() {
    this.image = '/assets/images/background1.jpg';
    this.route.fragment.subscribe(f => {
      const element = document.querySelector("#" + f)
      if (element) element.scrollIntoView()
    });
    this.getBackground();
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  toggleForm = () => {
    this.login = !this.login;
  }

  getBackground = () => {
    const backgrounds = [
      '/assets/images/background1.jpg',
      'https://c.pxhere.com/photos/96/03/meat_bbq_food_barbecue_beef_cooking_eating_fire-807571.jpg!d',
      'https://www.goodfreephotos.com/albums/food/cooking-ingredients-with-avocado-mushrooms-eggs.jpg',
      'https://images.pexels.com/photos/45247/potato-cook-pot-eat-45247.jpeg?cs=srgb&dl=container-cook-cooking-45247.jpg&fm=jpg',
    ];

    let current = 0;
    setInterval(() => {
      current++;
      current = current % backgrounds.length;
      this.image = backgrounds[current];
    }, 5000);
  }
}
