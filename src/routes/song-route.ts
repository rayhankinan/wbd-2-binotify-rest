import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { SOAPMiddleware } from "../middlewares/soap-middleware";
import { SongController } from "../controllers/song-controller";

export class SongRoute {
    songController: SongController;
    authenticationMiddleware: AuthenticationMiddleware;
    soapMiddleware: SOAPMiddleware;

    constructor() {
        this.songController = new SongController();
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.soapMiddleware = new SOAPMiddleware();
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
