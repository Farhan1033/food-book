import { CreateUserRequest } from "../../shared/dto/auth.dto";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { hashPassword, comparePassword } from "../../shared/utils/hash";

export class UserService {
    static async signUp(data: CreateUserRequest) {
        const [exsitingUser, findError] = await UserRepository.findByEmail(data.email)
        if (findError) {
            throw ErrInternalServerError;
        }
        if (exsitingUser) {
            throw ErrEmailFound;
        }

        const hasedPassword = await hashPassword(data.password);
        const [userSignIn, error] = await UserRepository.signUp({ ...data, passwordHasing: hasedPassword })
        if (error) {
            throw ErrInternalServerError
        }

        return [userSignIn, null]
    }
}