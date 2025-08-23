export interface Reaction {
    id: string;
    type: string;
    userId: string;
    recipeId: string;
    createdAt: Date;
}