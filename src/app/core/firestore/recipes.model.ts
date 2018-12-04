export interface FirebaseRecipeModel {
  calories: number,
  cookTime: number,
  directions: string[],
  images: string[],
  ingredients: string[],
  keywords: string[],
  meals: object,
  myRating: number,
  notes?: string[],
  prepTime?: number,
  src: string,
  tags?: string[],
  title: string,
  totalTime?: number,
  url: string,
  userId: string,
  yield: number
}