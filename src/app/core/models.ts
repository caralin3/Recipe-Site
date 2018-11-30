export interface User {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

export interface Image {
  id: string;
  file: string;
  name: string;
  path: string;
  size: number;
  src: string;
  userId: string;
}

export interface Ingredient {
  amount: number,
  id: string,
  item: string,
  unit: string
}

export type mealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'side' | 'appetizer';

export interface Recipe {
  calories: number,
  cookTime: number,
  directions: string[],
  id: string,
  images: string[],
  ingredients: string[],
  keywords: string[],
  meals: object,
  myRating: number,
  notes: string[],
  prepTime?: number,
  // TODO: Add servings or url
  tags: string[],
  title: string;
  totalTime: number,
  userId: string,
  yield: number,
}

export interface ImportedRecipe {
  calories: number,
  cookTime: number,
  prepTime: number,
  directions: string[],
  ingredients: string[],
  notes: string[],
  servings: number,
  title: string,
  totalTime: number,
  url: string,
  yield: number,
  status: 'success' | 'failure'
}

export interface RecipeLists {
  id: string,
  name: string,
  recipeIds: string[],
}

export interface GroceryList {
  completed: string[],
  id: string,
  name: string,
  items: string[],
  userId: string,
}

export interface MealCalendar {
  date: string,
  meals: string[] // recipe ids
}
