import { mealType } from '../models';

export interface FirebaseRecipeModel {
  calories: number,
  cookTime: number,
  directions: string[],
  images: string[],
  ingredients: string[],
  meals: mealType[],
  myRating: number,
  notes: string,
  prepTime?: number,
  // rating: Rating,
  tags: string[],
  title: string,
  totalTime: number,
  userId: string,
  yield?: number
}