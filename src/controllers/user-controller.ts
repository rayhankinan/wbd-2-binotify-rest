import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "../models/user-model";
import { AuthToken } from "../middlewares/authentication-middleware";
import { jwtConfig } from "../config/jwt-config";

interface TokenRequest {
    username: string;
    password: string;
}

export class UserController {
    token() {
        return async (req: Request, res: Response) => {
            const { username, password }: TokenRequest = req.body;
        };
    }
}
