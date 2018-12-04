import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ImagesService } from '../../../app/core/firestore';
import { Image, Recipe } from '../../../app/core/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes-item',
  templateUrl: './recipes-item.component.html',
  styleUrls: ['./recipes-item.component.scss']
})
export class RecipesItemComponent implements OnInit, OnDestroy {
  @Input() recipe: Recipe;
  @Input() planner: boolean;

  thumbnail: Image = {
    file: 'background1.png',
    id: '',
    path: '/assets/images/background1.jpg',
    name: 'default',
    size: 0,
    src: '/assets/images/background1.jpg',
    userId: '',
  };

  private subscriptions: Subscription[] = [];

  constructor(private imagesService: ImagesService) { }

  ngOnInit() {
    if (this.recipe.images && this.recipe.images.length > 0) {
      this.subscriptions.push(this.imagesService.getImageFromPath(this.recipe.images[0])
        .subscribe(imgs => imgs.forEach(img => this.thumbnail = img)));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
