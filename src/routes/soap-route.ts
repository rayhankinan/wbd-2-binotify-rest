import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { SOAPMiddleware } from "../middlewares/soap-middleware";
import { SoapController } from "../controllers/soap-controller";

export class SoapRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    soapController: SoapController;
    soapMiddleware: SOAPMiddleware;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.soapController = new SoapController();
        this.soapMiddleware = new SOAPMiddleware();
    }

    getRoute() {
        return Router()
            .post("/subscribe/accept",this.soapController.accept())
            .post("/subscribe/reject", this.soapController.reject())
            // .post(
            //     "/subscribe",
            //     this.authenticationMiddleware.authenticate(),
            //     this.soapController.index()
            // )
    }
}
