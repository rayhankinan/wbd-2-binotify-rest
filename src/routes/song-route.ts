import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { UploadMiddleware } from "../middlewares/upload-middleware";
import { SOAPMiddleware } from "../middlewares/soap-middleware";
import { SongController } from "../controllers/song-controller";

export class SongRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    uploadMiddleware: UploadMiddleware;
    soapMiddleware: SOAPMiddleware;
    songController: SongController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.uploadMiddleware = new UploadMiddleware();
        this.soapMiddleware = new SOAPMiddleware();
        this.songController = new SongController();
    }

    getRoute() {
        return Router()
            .post(
                "/song",
                this.authenticationMiddleware.authenticate(),
                this.uploadMiddleware.upload("file"),
                this.songController.store()
            )
            .get(
                "/song",
                this.authenticationMiddleware.authenticate(),
                this.songController.index()
            )
            .get(
                "/song/:id",
                this.authenticationMiddleware.authenticate(),
                this.songController.show()
            )
            .put(
                "/song/title/:id",
                this.authenticationMiddleware.authenticate(),
                this.songController.updateTitle()
            )
            .put(
                "/song/:id",
                this.authenticationMiddleware.authenticate(),
                this.uploadMiddleware.upload("file"),
                this.songController.update()
            )
            .delete(
                "/song/:id",
                this.authenticationMiddleware.authenticate(),
                this.songController.delete()
            )
            .get(
                "/app/song/:artistID", 
                // this.soapMiddleware.validate(),
                this.songController.indexArtist())
            .get(
                "/app/song/listen/:songID", 
                // this.soapMiddleware.validate(),
                this.songController.fetchSong());
    }
}
