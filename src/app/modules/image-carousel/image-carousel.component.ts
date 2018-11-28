import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { Image, Recipe } from '../../../app/core/models';
import { Observable, Subscription, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ImagesService, RecipesService } from 'src/app/core/firestore';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit, OnDestroy {
  @Input() search: boolean;
  @Input() lowerRightCaption: string;
  @Input() title: string;
  currentIndex: number = 0;
  innerWidth: number;
  mobile: boolean = false;
  recipe$: Observable<Recipe>;
  recipes$: Observable<Recipe[]>;
  images$: Observable<Image[]>;
  images: Image[] = [];
  image: Image;

  private subscriptions: Subscription[] = [];
  private defaultImage: Image = {
    id: '',
    file: '',
    path: '',
    name: '',
    size: 0,
    src: '',
    userId: ''
  }
  private defaultImages: Image[] = [
    {...this.defaultImage, src: '/assets/images/background1.jpg', name: 'background1'} as Image,
    {...this.defaultImage, src: 'https://c.pxhere.com/photos/96/03/meat_bbq_food_barbecue_beef_cooking_eating_fire-807571.jpg!d', name: 'bbq'} as Image,
    {...this.defaultImage, src: 'https://www.goodfreephotos.com/albums/food/cooking-ingredients-with-avocado-mushrooms-eggs.jpg', name: 'avocado'} as Image,
    {...this.defaultImage, src: 'https://images.pexels.com/photos/45247/potato-cook-pot-eat-45247.jpeg?cs=srgb&dl=container-cook-cooking-45247.jpg&fm=jpg', name: 'potato'} as Image,
  ];

  constructor(
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    public recipesService: RecipesService
  ) { }

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
    this.recipe$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return [];
        }
        return this.recipesService.getRecipe(id);
      })
    );
    if (this.route.snapshot.paramMap.get('id')) {
      this.recipeDetailImages();
    } else {
      this.recipes$ = this.recipesService.getLimitRecipes(5);
      this.recipeImages();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  recipeDetailImages = () => {
    this.subscriptions.push(this.recipe$.subscribe(rec => {
      rec.images.forEach((path) => {
        this.images$ = (this.imagesService.getImageFromPath(path));
        this.subscriptions.push(this.images$.subscribe(imgs => {
          this.images.push(imgs[0]);
          this.image = this.images[0];
        }));
      });
      this.startCarousel();
    }));
  }

  recipeImages = () => {
    this.subscriptions.push(this.recipes$.subscribe(recs => {
      if (recs.length === 0) {
        this.noImages();
      } else {
        let idx = 0;
        recs.forEach((rec) => {
          if (rec.images && rec.images.length > 0) {
            const path = rec.images[0];
            this.images$ = this.imagesService.getImageFromPath(path);
            this.subscriptions.push(this.images$.subscribe(imgs => {
              this.images.push(imgs[0]);
            }));
          } else {
            this.images.push(this.defaultImages[idx]);
            idx++;
          }
          this.image = this.images[0];
        });
        this.startCarousel();
      }
    }));
  }

  noImages = () => {
    this.images = this.defaultImages;
    this.image = this.images[0];
    this.startCarousel();
  }

  startCarousel = () => {
    setInterval(() => {
      this.currentIndex++;
      this.currentIndex = this.currentIndex % this.images.length;
      this.image = this.images[this.currentIndex];
    }, 5000);
  }
  
  selectImage = (index: number) => {
    this.currentIndex = index;
    this.image = this.images[this.currentIndex];
  }
}
