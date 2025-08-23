import { CreateUserRequest, LoginUserRequest } from "../../shared/dto/auth.dto";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { hashPassword, comparePassword } from "../../shared/utils/hash";
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../../shared/middleware/jwt";
import { CustomError } from "../../shared/custom_error/errors";
import { User } from "../domain/user/user";
import { AuthValidator } from "../../shared/validators/authValidator";

export class UserService {
    static async signUp(data: CreateUserRequest): Promise<Omit<User, 'password'>> {
        AuthValidator.validateSignUpData(data)

        const normalizedEmail = data.email.toLowerCase().trim();

        const [existingUser, findError] = await UserRepository.findByEmail(normalizedEmail)
        if (findError) {
            throw new CustomError("Internal server error", 500);
        }
        if (existingUser) {
            throw new CustomError("Email already registered", 409)
        }

        const hashedPassword = await hashPassword(data.password);
        const [newUser, error] = await UserRepository.signUp({
            fullName: data.fullName.trim(),
            email: data.email,
            password: hashedPassword,
            avatar: null,
            bio: null
        })

        if (error) {
            throw new CustomError("Failed to create user", 500);
        }
        if (!newUser) {
            throw new CustomError("Failed to create user", 500);
        }

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    static async signIn(data: LoginUserRequest): Promise<{ userId: string, token: string }> {
        AuthValidator.validateSignInData(data)

        const normalizedEmail = data.email.toLowerCase().trim();

        const [existingUser, findError] = await UserRepository.findByEmail(normalizedEmail)
        if (findError) {
            throw new CustomError("Internal server error", 500);
        }
        if (!existingUser) {
            throw new CustomError("Invalid email or password", 401)
        }

        const isMatch = await comparePassword(data.password, existingUser.password)
        if (!isMatch) {
            throw new CustomError("Invalid email or password", 401);
        }

        const payload = {
            userId: existingUser.id,
            email: existingUser.email
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' })

        return { userId: existingUser.id, token }
    }
}