import { CustomError } from "../custom_error/errors";
import { CreateUserRequest, LoginUserRequest } from "../dto/auth.dto";

export class AuthValidator {
    private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    private static readonly PASSWORD_MIN_LENGTH = 8;

    static validateEmail(email: string): void {
        if (!email) {
            throw new CustomError("Email is required", 400);
        }

        if (!this.EMAIL_REGEX.test(email)) {
            throw new CustomError("Please enter a valid email address", 400)
        }

        if (email.length > 254) {
            throw new CustomError("Email address is too long", 400);
        }
    }

    static validatePassword(password: string): void {
        if (!password) {
            throw new CustomError("Password is required", 400);
        }

        if (password.length < this.PASSWORD_MIN_LENGTH) {
            throw new CustomError(`Password must be at least ${this.PASSWORD_MIN_LENGTH} characters long`, 400);
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            throw new CustomError("Password must contain at least one uppercase letter, one lowercase letter, and one number", 400);
        }
    }

    static validateFullName(fullName: string): void {
        if (!fullName) {
            throw new CustomError("Full name is required", 400);
        }

        if (fullName.trim().length < 2) {
            throw new CustomError("Full name must be at least 2 characters long", 400);
        }

        if (fullName.length > 100) {
            throw new CustomError("Full name is too long", 400);
        }

        if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
            throw new CustomError("Full name can only contain letters, spaces, apostrophes, and hyphens", 400);
        }
    }

    static validateSignUpData(data: CreateUserRequest): void {
        this.validateEmail(data.email);
        this.validatePassword(data.password);
        this.validateFullName(data.fullName);
    }

    static validateSignInData(data: LoginUserRequest): void {
        this.validateEmail(data.email);

        if (!data.password) {
            throw new CustomError("Password is required", 400);
        }
    }
}