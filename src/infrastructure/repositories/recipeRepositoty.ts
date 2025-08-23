import { CreateRecipeRequest, UpdateRecipeRequest } from "../../../shared/dto/recipe.dto";
import { DifficultyLevel, Recipe } from "../../domain/recipe/recipe";
import prisma from "../prismaClient";

export class RecipeRepository {
    static async createRecipe(data: CreateRecipeRequest, userId: string): Promise<[Recipe | null, Error | null]> {
        try {
            const prismaRecipe = await prisma.recipe.create({
                data: {
                    ...data,
                    userId,
                    servings: data.servings ?? 0,
                    cookingTime: data.cookingTime ?? 0,
                    difficulty: data.difficulty ?? DifficultyLevel.EASY,
                    isPublished: data.isPublished ?? false,
                    categoryId: data.categoryId ?? null
                }
            });
            return [prismaRecipe as Recipe, null];
        } catch (error: any) {
            return [null, error];
        }
    }

    static async findRecipe(): Promise<[Recipe[] | null, Error | null]> {
        try {
            const page = 1;
            const limit = 10;

            const recipes = await prisma.recipe.findMany({
                where: {
                    isPublished: true
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return [recipes as Recipe[], null];
        } catch (error: any) {
            return [null, error];
        }
    }

    static async searchRecipe(keyword: string, page: number, limit: number):
        Promise<[{ data: Recipe[], total: number, totalPages: number, currentPage: number } | null, Error | null]> {
        try {
            const total = await prisma.recipe.count({
                where: {
                    isPublished: true,
                    title: {
                        contains: keyword,
                        mode: 'insensitive'
                    }
                }
            })

            const recipe = await prisma.recipe.findMany({
                where: {
                    isPublished: true,
                    title: {
                        contains: keyword,
                        mode: 'insensitive'
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'asc'
                }
            })

            const totalPages = Math.ceil(total / limit)

            return [{
                data: recipe as Recipe[],
                total,
                totalPages,
                currentPage: page
            }, null];
        } catch (error) {
            return [null, error]
        }
    }

    static async filterRecipes(
        filters: {
            name?: string;
            categoryId?: string;
            difficulty?: string;
            isPublished?: boolean;
        },
        page: number,
        limit: number
    ): Promise<[{ data: Recipe[], total: number, totalPages: number, currentPage: number } | null, Error | null]> {
        try {
            const where: any = {};

            if (filters.isPublished !== undefined) {
                where.isPublished = filters.isPublished;
            }

            if (filters.name) {
                where.title = {
                    contains: filters.name,
                    mode: 'insensitive'
                };
            }

            if (filters.categoryId) {
                where.categoryId = filters.categoryId;
            }

            if (filters.difficulty) {
                where.difficulty = filters.difficulty;
            }

            const total = await prisma.recipe.count({ where });

            const recipes = await prisma.recipe.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, fullName: true }
                    },
                    category: {
                        select: { id: true, name: true }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" }
            });

            return [{
                data: recipes as Recipe[],
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }, null];
        } catch (error: any) {
            return [null, error];
        }
    }


    static async findRecipeById(id: string): Promise<[Recipe | null, Error | null]> {
        try {
            const recipe = await prisma.recipe.findUnique({ where: { id } })
            return [recipe as Recipe, null]
        } catch (error) {
            return [null, error]
        }
    }

    static async updateRecipe(id: string, data: UpdateRecipeRequest): Promise<[Recipe | null, Error | null]> {
        try {
            const updateData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(updateData).length === 0) {
                throw new Error("No valid data to update");
            }

            const updateRecipe = await prisma.recipe.update({
                where: { id },
                data: updateData
            })

            return [updateRecipe as Recipe, null]
        } catch (error) {
            return [null, error]
        }
    }

    static async deleteRecipe(id: string): Promise<[boolean, Error | null]> {
        try {
            await prisma.recipe.delete({ where: { id } });
            return [true, null];
        } catch (error: any) {
            return [false, error];
        }
    }
}