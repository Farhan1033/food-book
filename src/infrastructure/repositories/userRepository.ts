import prisma from "../prismaClient";
import { User } from "../../domain/user/user";
import { CreateUserRequest, UpdateUserRequest } from "../../../shared/dto/auth.dto";

export class UserRepository {
    static async signUp(data: Omit<CreateUserRequest, 'password'> & { password: string }): Promise<[User | null, Error | null]> {
        try {
            const user = await prisma.user.create({ data })
            return [user, null];
        } catch (error: any) {
            return [null, error]
        }
    }

    static async findByEmail(email: string): Promise<[User | null, Error | null]> {
        try {
            const user = await prisma.user.findUnique({ where: { email } })
            return [user, null]
        } catch (error: any) {
            return [null, error]
        }
    }

    static async findById(id: string): Promise<[User | null, Error | null]> {
        try {
            const user = await prisma.user.findUnique({ where: { id } })
            return [user, null]
        } catch (error) {
            return [null, error]
        }
    }

    static async updateUser(id: string, data: Partial<UpdateUserRequest>): Promise<[User | null, Error | null]> {
        try {
            const updateData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(updateData).length === 0) {
                throw new Error("No valid data to update");
            }

            const user = await prisma.user.update({
                where: { id },
                data: updateData
            });

            return [user, null];
        } catch (error: any) {
            return [null, error];
        }
    }

    static async deleteUser(id: string): Promise<[boolean, Error | null]> {
        try {
            await prisma.user.delete({ where: { id } });
            return [true, null];
        } catch (error: any) {
            return [false, error];
        }
    }
}