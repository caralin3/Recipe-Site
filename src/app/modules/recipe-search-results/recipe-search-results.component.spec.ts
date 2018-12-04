import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSearchResultsComponent } from './recipe-search-results.component';

describe('RecipeSearchResultsComponent', () => {
  let component: RecipeSearchResultsComponent;
  let fixture: ComponentFixture<RecipeSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
