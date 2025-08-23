export interface Ingredient {
    id: string;
    name: string;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}