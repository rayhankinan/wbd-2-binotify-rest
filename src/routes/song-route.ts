import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { SOAPMiddleware } from "../middlewares/soap-middleware";
import { SongController } from "../controllers/song-controller";

export class SongRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    soapMiddleware: SOAPMiddleware;
    songController: SongController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.soapMiddleware = new SOAPMiddleware();
        this.songController = new SongController();
    }

    getRoute() {
        return Router()
            .post(
                "/song",
                this.authenticationMiddleware.authenticate(),
                this.songController.store()
            )
            .get(
                "/song",
                this.authenticationMiddleware.authenticate(),
                this.soapMiddleware.validate(),
                this.songController.index()
            )
            .get(
                "/song/:id",
                this.authenticationMiddleware.authenticate(),
                this.soapMiddleware.validate(),
                this.songController.show()
            )
            .put(
                "/song/:id",
                this.authenticationMiddleware.authenticate(),
                this.songController.update()
            )
            .delete(
                "/song/:id",
                this.authenticationMiddleware.authenticate(),
                this.songController.delete()
            );
    }
}
