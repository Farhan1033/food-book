export interface CreateUserRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}