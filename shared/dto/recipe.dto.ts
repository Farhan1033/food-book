import { DifficultyLevel } from "@prisma/client";

export interface CreateRecipeRequest {
    title: string;
    description: string;
    imageUrl?: string | null;
    servings?: number;
    cookingTime?: number;
    difficulty?: DifficultyLevel;
    categoryId?: string | null;
    isPublished?: boolean;
}

export interface UpdateRecipeRequest {
    title?: string;
    description?: string;
    imageUrl?: string | null;
    servings?: number;
    cookingTime?: number;
    difficulty?: DifficultyLevel;
    categoryId?: string | null;
    isPublished?: boolean;
}