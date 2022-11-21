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
