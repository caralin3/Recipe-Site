import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeImportComponent } from './recipe-import.component';

describe('RecipeImportComponent', () => {
  let component: RecipeImportComponent;
  let fixture: ComponentFixture<RecipeImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
