import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import redis from "../../src/infrastructure/redisClient";

export const SECRET_KEY: Secret = 'K0p1Luw4k';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
    userId: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as CustomRequest).token = decoded;

        const userId = await redis.get(token);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid or expired session' });
        }
        (req as CustomRequest).userId = userId

        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
}