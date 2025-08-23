import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { CustomRequest } from "../../shared/middleware/jwt";
import redis from "../infrastructure/redisClient";

export class UserController {
    static async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const registerData = req.body
            const user = await UserService.signUp(registerData);
            return res.status(201).json({
                message: "User registered successfully",
                data: user
            })
        } catch (error: any) {
            next(error)
        }
    }

    static async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const loginData = req.body;
            const result = await UserService.signIn(loginData);

            return res.status(200).json({
                message: "Login successful",
                data: result,
            });
        } catch (error) {
            next(error)
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const customReq = req as CustomRequest;
            const token = customReq.header('Authorization')?.replace('Bearer ', '');
            if (token) {
                await redis.del(token);
            }
            res.json({ message: 'Logged out successfully' });
        } catch (err) {
            next(err);
        }
    }
}