import { CreateUserRequest, LoginUserRequest } from "../../shared/dto/auth.dto";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { hashPassword, comparePassword } from "../../shared/utils/hash";
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../../shared/middleware/jwt";
import { CustomError } from "../../shared/custom_error/errors";

export class UserService {
    static async signUp(data: CreateUserRequest) {
        if (data == null) {
            throw new CustomError("Input cannot be empty", 400)
        }

        const [exsitingUser, findError] = await UserRepository.findByEmail(data.email)
        if (findError) {
            throw new CustomError("Internal server error", 500);
        }
        if (exsitingUser) {
            throw new CustomError("Email already registered", 404)
        }

        const hasedPassword = await hashPassword(data.password);
        const [userSignIn, error] = await UserRepository.signUp({ ...data, passwordHasing: hasedPassword })
        if (error) {
            throw new CustomError("Internal server error", 500);
        }

        return [userSignIn, null]
    }

    static async signIn(data: LoginUserRequest): Promise<{ payload: { userId: string, email: string }, token: string }> {
        if (data == null) {
            throw new CustomError("Input cannot be empty", 400)
        }

        const [exsitingUser, findError] = await UserRepository.findByEmail(data.email)
        if (!exsitingUser) {
            throw new CustomError("Email not found!", 404)
        }
        if (findError) {
            throw new CustomError("Internal server error", 500);
        }

        const isMatch = await comparePassword(data.password, exsitingUser.password)
        if (!isMatch) {
            throw new CustomError("Incorrect password, please check again", 401);
        }

        const payload = {
            userId: exsitingUser.id,
            email: exsitingUser.email
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' })

        return { payload, token: token }
    }
}