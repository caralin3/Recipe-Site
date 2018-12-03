import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth';
import { UserResolver } from './core/user.resolver';
import {
  ContactComponent,
  GroceryComponent,
  HomeComponent,
  PlannerComponent,
  RecipesComponent,
  RecipeDetailComponent,
  RecipeEditComponent,
  RecipeFormComponent,
  RecipeImportComponent,
  RecipeSearchResultsComponent,
} from './modules';
import { UserComponent } from './modules/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, resolve: { data: UserResolver}},
  { path: 'recipes', component: RecipesComponent, resolve: { data: UserResolver}},
  { path: 'recipes/add', component: RecipeFormComponent, resolve: { data: UserResolver}},
  { path: 'recipes/edit/:id', component: RecipeEditComponent, resolve: { data: UserResolver}},
  { path: 'recipes/import', component: RecipeImportComponent, resolve: { data: UserResolver}},
  { path: 'recipes/search', component: RecipeSearchResultsComponent, resolve: { data: UserResolver}},
  { path: 'recipes/:id', component: RecipeDetailComponent, resolve: { data: UserResolver}},
  { path: 'grocery', component: GroceryComponent, resolve: { data: UserResolver}},
  { path: 'planner', component: PlannerComponent, resolve: { data: UserResolver}},
  { path: 'search', component: RecipesComponent, resolve: { data: UserResolver}},
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
