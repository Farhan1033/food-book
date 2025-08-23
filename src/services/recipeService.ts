import { CreateRecipeRequest, UpdateRecipeRequest } from "../../shared/dto/recipe.dto";
import { Recipe } from "../domain/recipe/recipe";
import { RecipeRepository } from "../infrastructure/repositories/recipeRepositoty";
import { RecipeValidator } from "../../shared/validators/recipeValidator";

export class RecipeService {
    static async createRecipe(data: CreateRecipeRequest, userId: string): Promise<[Recipe | null, Error | null]> {
        try {
            RecipeValidator.validateCreateInput(data);

            const [recipe, error] = await RecipeRepository.createRecipe(data, userId);

            if (error) {
                return [null, new Error(`Failed to create recipe: ${error.message}`)];
            }

            return [recipe, null];
        } catch (error: any) {
            return [null, new Error(`Service error: ${error.message}`)];
        }
    }

    static async getAllRecipes(): Promise<[Recipe[] | null, Error | null]> {
        try {
            const [recipes, error] = await RecipeRepository.findRecipe();

            if (error) {
                return [null, new Error(`Failed to get recipes: ${error.message}`)];
            }

            return [recipes, null];
        } catch (error: any) {
            return [null, new Error(`Service error: ${error.message}`)];
        }
    }

    static async searchRecipes(
        keyword: string,
        page: number = 1,
        limit: number = 10
    ): Promise<[{ data: Recipe[], total: number, totalPages: number, currentPage: number } | null, Error | null]> {
        try {
            RecipeValidator.validateSearchKeyword(keyword);
            const pagination = RecipeValidator.validatePagination(page.toString(), limit.toString());

            const [result, error] = await RecipeRepository.searchRecipe(keyword.trim(), pagination.page, pagination.limit);

            if (error) {
                return [null, new Error(`Failed to search recipes: ${error.message}`)];
            }

            return [result, null];
        } catch (error: any) {
            return [null, new Error(`Service error: ${error.message}`)];
        }
    }

    static async filterRecipes(
        filters: {
            name?: string;
            categoryId?: string;
            difficulty?: string;
            isPublished?: boolean;
        },
        page: number = 1,
        limit: number = 10
    ): Promise<[{ data: Recipe[], total: number, totalPages: number, currentPage: number } | null, Error | null]> {
        try {
            const pagination = RecipeValidator.validatePagination(page.toString(), limit.toString());

            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => {
                    if (typeof value === 'string') {
                        return value.trim() !== '';
                    }
                    return value !== undefined && value !== null;
                })
            );

            const [result, error] = await RecipeRepository.filterRecipes(cleanFilters, pagination.page, pagination.limit);

            if (error) {
                return [null, new Error(`Failed to filter recipes: ${error.message}`)];
            }

            return [result, null];
        } catch (error: any) {
            return [null, new Error(`Service error: ${error.message}`)];
        }
    }

    static async getRecipeById(id: string): Promise<[Recipe | null, Error | null]> {
        try {
            RecipeValidator.validateId(id);

            const [recipe, error] = await RecipeRepository.findRecipeById(id);

            if (error) {
                return [null, new Error(`Failed to get recipe: ${error.message}`)];
            }

            if (!recipe) {
                return [null, new Error("Recipe not found")];
            }

            return [recipe, null];
        } catch (error: any) {
            return [null, new Error(`Service error: ${error.message}`)];
        }
    }

    static async updateRecipe(id: string, data: UpdateRecipeRequest): Promise<[Recipe | null, Error | null]> {
        try {
            RecipeValidator.validateId(id);

            const [existingRecipe, findError] = await RecipeRepository.findRecipeById(id);
            if (findError) {
                return [null, new Error(`Failed to find recipe: ${findError.message}`)];
            }

            if (!existingRecipe) {
                return [null, new Error("Recipe not found")];
            }

            RecipeValidator.validateUpdateInput(data);

            const [updatedRecipe, error] = await RecipeRepository.updateRecipe(id, data);

            if (error) {
                return [null, new Error(`Failed to update recipe: ${error.message}`)];
            }

            return [updatedRecipe, null];
        } catch (error: any) {
            return [null, new Error(`Service error: ${error.message}`)];
        }
    }

    static async deleteRecipe(id: string, userId: string): Promise<[boolean, Error | null]> {
        try {
            RecipeValidator.validateId(id);

            const [recipe, findError] = await RecipeRepository.findRecipeById(id);
            if (findError) {
                return [false, new Error(`Failed to find recipe: ${findError.message}`)];
            }

            if (!recipe) {
                return [false, new Error("Recipe not found")];
            }

            if ((recipe as any).userId !== userId) {
                return [false, new Error("Unauthorized to delete this recipe")];
            }

            const [success, error] = await RecipeRepository.deleteRecipe(id);

            if (error) {
                return [false, new Error(`Failed to delete recipe: ${error.message}`)];
            }

            return [success, null];
        } catch (error: any) {
            return [false, new Error(`Service error: ${error.message}`)];
        }
    }
}