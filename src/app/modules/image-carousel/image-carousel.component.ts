import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Image } from '../../../app/core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() images: Image[] | any;
  // @Input() images: Observable<Image>[] | any;
  @Input() search: boolean;
  @Input() lowerRightCaption: string;
  @Input() title: string;
  image: any;
  currentIndex: number;
  innerWidth: number;
  mobile: boolean = false;

  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 760) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  ngOnInit() {
    this.onResize();
    this.getImage();
  }

  getImages = () => {
    // const images: Image[] = [];
    // if (!this.images) {
    //   // images = []
    // } else {
    //   this.images.forEach((imgs) => {
    //     imgs.forEach((img) => {
    //       images.push(img);
    //     })
    //   })
    // }
    console.log(this.images);
  }
  
  getImage = () => {
    if (!this.images || this.images.length == 0) {
      const image: Image = {
        id: '',
        file: '',
        path: '',
        name: '',
        size: 0,
        src: '',
        userId: ''
      }
      this.images = [
        [[{...image, src: '/assets/images/background1.jpg', name: 'background1'} as Image]],
        [[{...image, src: 'https://c.pxhere.com/photos/96/03/meat_bbq_food_barbecue_beef_cooking_eating_fire-807571.jpg!d', name: 'bbq'} as Image]],
        [[{...image, src: 'https://www.goodfreephotos.com/albums/food/cooking-ingredients-with-avocado-mushrooms-eggs.jpg', name: 'avocado'} as Image]],
        [[{...image, src: 'https://images.pexels.com/photos/45247/potato-cook-pot-eat-45247.jpeg?cs=srgb&dl=container-cook-cooking-45247.jpg&fm=jpg', name: 'potato'} as Image]],
      ];
    }
    this.images[0].forEach(img => {
      this.image = img[0];
    });
    // if (!this.image) {
    //   this.image = {
    //     src: '/assets/images/background1.jpg',
    //   };
    // }
    this.currentIndex = 0;
    // this.images.forEach(imgs => imgs.forEach(img => {
    //   console.log(img);
    // }));
    setInterval(() => {
      this.currentIndex++;
      this.currentIndex = this.currentIndex % this.images.length;
      this.images[this.currentIndex].forEach(img => this.image = img[0]);
    }, 5000);
  }
  
  selectImage = (index: number) => {
    this.currentIndex = index;
    this.images[this.currentIndex].forEach(img => this.image = img[0]);
  }
}
