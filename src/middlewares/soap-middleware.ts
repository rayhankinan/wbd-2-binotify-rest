import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

import { AuthRequest } from "./authentication-middleware";
import { SOAPService } from "../services/soap-services";

interface ValidateRequest {
    creatorID: number;
}

export class SOAPMiddleware {
    soapServices: SOAPService;

    constructor() {
        this.soapServices = new SOAPService();
    }

    validate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { token } = req as AuthRequest;
            const { creatorID }: ValidateRequest = req.body;
            if (!token || !creatorID) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const isValidated = await this.soapServices.validate(
                creatorID,
                token.userID
            );
            if (!isValidated) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            next();
        };
    }
}
