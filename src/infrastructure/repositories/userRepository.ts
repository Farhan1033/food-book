import prisma from "../prismaClient";
import { User } from "../../domain/user/user";
import { CreateUserRequest } from "../../../shared/dto/auth.dto";

export class UserRepository {
    static async signUp(data: CreateUserRequest & { passwordHasing: string }): Promise<[User | null, Error | null]> {
        try {
            const user = await prisma.user.create({ data })
            return [user, null];
        } catch (error: any) {
            return [null, error]
        }
    }

    static async findByEmail(email: string): Promise<[User | null, Error | null]> {
        try {
            const user = await prisma.user.findUniqe({ where: { email } })
            return [user, null]
        } catch (error: any) {
            return [null, error]
        }
    }
}