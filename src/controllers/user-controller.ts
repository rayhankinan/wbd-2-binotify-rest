import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AuthToken } from "../middlewares/authentication-middleware";
import { jwtConfig } from "../config/jwt-config";
import { User } from "../models/user-model";

interface TokenRequest {
    username: string;
    password: string;
}

interface StoreRequest {
    email: string;
    username: string;
    name: string;
    password: string;
}

export class UserController {
    token() {
        return async (req: Request, res: Response) => {
            const { username, password }: TokenRequest = req.body;
            if (!username || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const foundUser = await User.findOne({
                where: { username },
            });
            if (!foundUser) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Username is incorrect",
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (!isMatch) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Password is incorrect",
                });
                return;
            }

            const { userID, isAdmin } = foundUser;
            const payload: AuthToken = {
                userID,
                isAdmin,
            };
            const token = jwt.sign(payload, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                token,
            });
        };
    }

    store() {
        return async (req: Request, res: Response) => {
            const { email, username, name, password }: StoreRequest = req.body;
            if (!email || !username || !name || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const user = new User();
            user.email = email;
            user.username = username;
            user.name = name;
            user.password = password;

            const newUser = await user.save();
            if (!newUser) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const { userID, isAdmin } = newUser;
            const payload: AuthToken = {
                userID,
                isAdmin,
            };
            const token = jwt.sign(payload, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            res.status(StatusCodes.CREATED).json({
                message: ReasonPhrases.CREATED,
                token,
            });
        };
    }
}
