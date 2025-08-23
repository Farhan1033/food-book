export interface User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    avatar: string | null;
    bio: string | null;
    createdAt: Date;
    updatedAt: Date;
}
