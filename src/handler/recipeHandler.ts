import { Request, Response } from 'express';
import { CreateRecipeRequest, UpdateRecipeRequest } from '../../shared/dto/recipe.dto';
import { RecipeService } from '../services/recipeService';
import { CustomRequest } from '../../shared/middleware/jwt';

export class RecipeHandler {
    static async createRecipe(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).userId

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized - User ID not found'
                });
                return;
            }

            const recipeData: CreateRecipeRequest = req.body;

            const [recipe, error] = await RecipeService.createRecipe(recipeData, userId);

            if (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(201).json({
                success: true,
                message: 'Recipe created successfully',
                data: recipe
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async getAllRecipes(req: Request, res: Response): Promise<void> {
        try {
            const [recipes, error] = await RecipeService.getAllRecipes();

            if (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Recipes retrieved successfully',
                data: recipes
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async searchRecipes(req: Request, res: Response): Promise<void> {
        try {
            const { keyword, page = '1', limit = '10' } = req.query;

            if (!keyword || typeof keyword !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Search keyword is required'
                });
                return;
            }

            const pageNum = parseInt(page as string) || 1;
            const limitNum = parseInt(limit as string) || 10;

            const [result, error] = await RecipeService.searchRecipes(keyword, pageNum, limitNum);

            if (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Recipes searched successfully',
                data: result?.data,
                pagination: {
                    total: result?.total,
                    totalPages: result?.totalPages,
                    currentPage: result?.currentPage,
                    limit: limitNum
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async filterRecipes(req: Request, res: Response): Promise<void> {
        try {
            const { name, categoryId, difficulty, isPublished, page = '1', limit = '10' } = req.query;

            const filters = {
                name: name as string,
                categoryId: categoryId as string,
                difficulty: difficulty as string,
                isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined
            };

            const pageNum = parseInt(page as string) || 1;
            const limitNum = parseInt(limit as string) || 10;

            const [result, error] = await RecipeService.filterRecipes(filters, pageNum, limitNum);

            if (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Recipes filtered successfully',
                data: result?.data,
                pagination: {
                    total: result?.total,
                    totalPages: result?.totalPages,
                    currentPage: result?.currentPage,
                    limit: limitNum
                },
                filters: filters
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async getRecipeById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const [recipe, error] = await RecipeService.getRecipeById(id);

            if (error) {
                const statusCode = error.message === 'Recipe not found' ? 404 : 400;
                res.status(statusCode).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Recipe retrieved successfully',
                data: recipe
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async updateRecipe(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as CustomRequest).userId

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized - User ID not found'
                });
                return;
            }

            const updateData: UpdateRecipeRequest = req.body;

            const [updatedRecipe, error] = await RecipeService.updateRecipe(id, updateData);

            if (error) {
                const statusCode = error.message === 'Recipe not found' ? 404 : 400;
                res.status(statusCode).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Recipe updated successfully',
                data: updatedRecipe
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async deleteRecipe(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as CustomRequest).userId

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized - User ID not found'
                });
                return;
            }

            const [success, error] = await RecipeService.deleteRecipe(id, userId);

            if (error) {
                let statusCode = 400;
                if (error.message === 'Recipe not found') {
                    statusCode = 404;
                } else if (error.message === 'Unauthorized to delete this recipe') {
                    statusCode = 403;
                }

                res.status(statusCode).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Recipe deleted successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}