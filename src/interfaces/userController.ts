import { Request, Response } from "express";
import { UserService } from "../application/userService";


export class UserController {
    static async signIn(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid input: email, password, and name are required"
                });
            }

            const user = await UserService.signUp(req.body);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}