import { CustomError } from "../custom_error/errors";
import { CreateRecipeRequest, UpdateRecipeRequest } from "../dto/recipe.dto";

export class RecipeValidator {
    private static readonly DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"];
    private static readonly MAX_TITLE_LENGTH = 100;
    private static readonly MIN_TITLE_LENGTH = 2;
    private static readonly MAX_DESCRIPTION_LENGTH = 1000;
    private static readonly MAX_COOKING_TIME = 1440;
    private static readonly MAX_SERVINGS = 100;

    static validateCreateInput(data: CreateRecipeRequest): void {
        this.validateTitle(data.title);

        this.validateDescription(data.description);

        if (data.servings !== undefined) {
            this.validateServings(data.servings);
        }

        if (data.cookingTime !== undefined) {
            this.validateCookingTime(data.cookingTime);
        }

        if (data.difficulty !== undefined) {
            this.validateDifficultyLevel(data.difficulty);
        }

        if (data.categoryId !== undefined) {
            this.validateCategoryId(data.categoryId);
        }
    }

    static validateUpdateInput(data: UpdateRecipeRequest): void {
        if (data.title !== undefined) {
            this.validateTitle(data.title);
        }

        if (data.description !== undefined) {
            this.validateDescription(data.description);
        }

        if (data.servings !== undefined) {
            this.validateServings(data.servings);
        }

        if (data.cookingTime !== undefined) {
            this.validateCookingTime(data.cookingTime);
        }

        if (data.difficulty !== undefined) {
            this.validateDifficultyLevel(data.difficulty);
        }

        if (data.categoryId !== undefined) {
            this.validateCategoryId(data.categoryId);
        }

        if (data.isPublished !== undefined) {
            this.validateIsPublished(data.isPublished);
        }
    }

    private static validateTitle(title: string): void {
        if (!title || typeof title !== 'string') {
            throw new CustomError("Title is required", 400);
        }

        const trimmedTitle = title.trim();

        if (trimmedTitle === '') {
            throw new CustomError("Title cannot be empty", 400);
        }

        if (trimmedTitle.length < this.MIN_TITLE_LENGTH) {
            throw new CustomError(`Title must be at least ${this.MIN_TITLE_LENGTH} characters long`, 400);
        }

        if (trimmedTitle.length > this.MAX_TITLE_LENGTH) {
            throw new CustomError(`Title cannot exceed ${this.MAX_TITLE_LENGTH} characters`, 400);
        }

        const titleRegex = /^[a-zA-Z0-9\s\-_.,!?()&]+$/;
        if (!titleRegex.test(trimmedTitle)) {
            throw new CustomError("Title contains invalid characters", 400);
        }
    }

    private static validateDescription(description: string): void {
        if (!description || typeof description !== 'string') {
            throw new CustomError("Description is required", 400);
        }

        const trimmedDescription = description.trim();

        if (trimmedDescription === '') {
            throw new CustomError("Description cannot be empty", 400);
        }

        if (trimmedDescription.length > this.MAX_DESCRIPTION_LENGTH) {
            throw new CustomError(`Description cannot exceed ${this.MAX_DESCRIPTION_LENGTH} characters`, 400);
        }
    }

    private static validateInstructions(instructions: string[]): void {
        if (!Array.isArray(instructions)) {
            throw new CustomError("Instructions must be an array", 400);
        }

        if (instructions.length === 0) {
            throw new CustomError("At least one instruction is required", 400);
        }

        instructions.forEach((instruction, index) => {
            if (!instruction || typeof instruction !== 'string') {
                throw new CustomError(`Instruction ${index + 1} must be a non-empty string`, 400);
            }

            if (instruction.trim() === '') {
                throw new CustomError(`Instruction ${index + 1} cannot be empty`, 400);
            }

            if (instruction.trim().length > 500) {
                throw new CustomError(`Instruction ${index + 1} is too long (max 500 characters)`, 400);
            }
        });
    }

    private static validateIngredients(ingredients: string[]): void {
        if (!Array.isArray(ingredients)) {
            throw new CustomError("Ingredients must be an array", 400);
        }

        if (ingredients.length === 0) {
            throw new CustomError("At least one ingredient is required", 400);
        }

        ingredients.forEach((ingredient, index) => {
            if (!ingredient || typeof ingredient !== 'string') {
                throw new CustomError(`Ingredient ${index + 1} must be a non-empty string`, 400);
            }

            if (ingredient.trim() === '') {
                throw new CustomError(`Ingredient ${index + 1} cannot be empty`, 400);
            }

            if (ingredient.trim().length > 200) {
                throw new CustomError(`Ingredient ${index + 1} is too long (max 200 characters)`, 400);
            }
        });
    }

    private static validateServings(servings: number): void {
        if (typeof servings !== 'number' || !Number.isInteger(servings)) {
            throw new CustomError("Servings must be a whole number", 400);
        }

        if (servings < 1) {
            throw new CustomError("Servings must be at least 1", 400);
        }

        if (servings > this.MAX_SERVINGS) {
            throw new CustomError(`Servings cannot exceed ${this.MAX_SERVINGS}`, 400);
        }
    }

    private static validateCookingTime(cookingTime: number): void {
        if (typeof cookingTime !== 'number' || !Number.isInteger(cookingTime)) {
            throw new CustomError("Cooking time must be a whole number (in minutes)", 400);
        }

        if (cookingTime < 0) {
            throw new CustomError("Cooking time cannot be negative", 400);
        }

        if (cookingTime > this.MAX_COOKING_TIME) {
            throw new CustomError(`Cooking time cannot exceed ${this.MAX_COOKING_TIME} minutes (24 hours)`, 400);
        }
    }

    private static validateDifficultyLevel(difficulty: string): void {
        if (!difficulty || typeof difficulty !== 'string') {
            throw new CustomError("Difficulty level is required", 400);
        }

        if (!this.DIFFICULTY_LEVELS.includes(difficulty.toUpperCase())) {
            throw new CustomError(`Difficulty level must be one of: ${this.DIFFICULTY_LEVELS.join(', ')}`, 400);
        }
    }

    private static validateCategoryId(categoryId: string | null): void {
        if (!categoryId || typeof categoryId !== 'string') {
            throw new CustomError("Category ID must be a non-empty string", 400);
        }

        const trimmedCategoryId = categoryId.trim();

        if (trimmedCategoryId === '') {
            throw new CustomError("Category ID cannot be empty", 400);
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedCategoryId)) {
            throw new CustomError("Category ID must be a valid UUID", 400);
        }
    }


    private static validateIsPublished(isPublished: boolean): void {
        if (typeof isPublished !== 'boolean') {
            throw new CustomError("isPublished must be a boolean value", 400);
        }
    }

    static validateId(id: string): void {
        if (!id || typeof id !== 'string') {
            throw new CustomError("ID is required", 400);
        }

        const trimmedId = id.trim();

        if (trimmedId === '') {
            throw new CustomError("ID cannot be empty", 400);
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedId)) {
            throw new CustomError("ID must be a valid UUID", 400);
        }
    }

    static validatePagination(page?: string, limit?: string): { page: number, limit: number } {
        const pageNum = parseInt(page || '1');
        const limitNum = parseInt(limit || '10');

        if (isNaN(pageNum) || pageNum < 1) {
            throw new CustomError("Page must be a positive number", 400);
        }

        if (isNaN(limitNum) || limitNum < 1) {
            throw new CustomError("Limit must be a positive number", 400);
        }

        if (limitNum > 100) {
            throw new CustomError("Limit cannot exceed 100", 400);
        }

        return { page: pageNum, limit: limitNum };
    }

    static validateSearchKeyword(keyword: string): void {
        if (!keyword || typeof keyword !== 'string') {
            throw new CustomError("Search keyword is required", 400);
        }

        const trimmedKeyword = keyword.trim();

        if (trimmedKeyword === '') {
            throw new CustomError("Search keyword cannot be empty", 400);
        }

        if (trimmedKeyword.length < 2) {
            throw new CustomError("Search keyword must be at least 2 characters long", 400);
        }

        if (trimmedKeyword.length > 50) {
            throw new CustomError("Search keyword is too long (max 50 characters)", 400);
        }
    }
}