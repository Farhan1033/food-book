import  bcrypt  from "bcryptjs"

// Hashing password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

// Compare password
export async function comparePassword(password:string, hashPw: string): Promise<boolean> {
    return bcrypt.compare(password, hashPw)
}