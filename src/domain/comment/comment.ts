export interface Comment {
    id: string;
    content: string;
    rating?: Int16Array;
    userId: string;
    recipeId: string;
    craetedAt: Date;
    updatedAt: Date;
}
