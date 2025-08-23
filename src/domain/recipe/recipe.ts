export interface Recipe {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    servings?: number | null;
    cookingTime?: number | null;
    difficulty: DifficultyLevel;
    isPublished: boolean;
    userId: string;
    categoryId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export enum DifficultyLevel {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}