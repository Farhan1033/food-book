import { Request, Response, NextFunction } from "express";
import { CustomError } from "../custom_error/errors";

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
};
