export interface RecipeIngredient {
    id: string;
    quantity: Float32Array;
    unit: string;
    notes?: string;
    recipeId: string;
    ingredientId: string;
}
