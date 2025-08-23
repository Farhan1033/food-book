export interface CreateUserRequest {
    fullName: string;
    email: string;
    password: string;
    avatar: string | null;
    bio: string | null;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    fullName?: string;
    email?: string;
    avatar?: string | null;
    bio?: string | null;
}