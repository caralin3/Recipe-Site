import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() search: boolean;
  @Input() lowerRightCaption: string;
  @Input() title: string;
  image: { src: string };
  images: string[];
  currentIndex: number;

  constructor() { }

  ngOnInit() {
    this.image = {
      src: '/assets/images/background1.jpg',
    };
    this.getImage();
  }

  getImage = () => {
    this.images = [
      '/assets/images/background1.jpg',
      'https://c.pxhere.com/photos/96/03/meat_bbq_food_barbecue_beef_cooking_eating_fire-807571.jpg!d',
      'https://www.goodfreephotos.com/albums/food/cooking-ingredients-with-avocado-mushrooms-eggs.jpg',
      'https://images.pexels.com/photos/45247/potato-cook-pot-eat-45247.jpeg?cs=srgb&dl=container-cook-cooking-45247.jpg&fm=jpg',
      'https://www.goodfreephotos.com/albums/food/cooking-ingredients-with-avocado-mushrooms-eggs.jpg',
    ];

    this.currentIndex = 0;
    setInterval(() => {
      this.currentIndex++;
      this.currentIndex = this.currentIndex % this.images.length;
      this.image.src = this.images[this.currentIndex];
    }, 5000);
  }

  selectImage = (index: number) => {
    this.currentIndex = index;
    this.image.src = this.images[this.currentIndex];
  }
}
