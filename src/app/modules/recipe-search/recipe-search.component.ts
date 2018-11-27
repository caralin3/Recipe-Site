import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  @Input() comp: string;

  constructor() { }

  ngOnInit() {
  }

}
