import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { jwtConfig } from "../config/jwt-config";

export interface AuthToken {
    id: number;
    isAdmin: boolean;
}

export interface AuthRequest extends Request {
    token: AuthToken;
}

export class Authentication {
    async authenticate(req: Request, res: Response, next: NextFunction) {
        if (req.path === "/user/token") {
            next();
            return;
        }

        const token = req.header("Authorization")?.replace("Bearer ", "");
    }
}
