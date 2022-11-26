import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { SOAPMiddleware } from "../middlewares/soap-middleware";
import { SongController } from "../controllers/song-controller";

import * as path from 'path';
import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "..", "uploads"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, path.parse(file.originalname).name + '-' + uniqueSuffix + ".mp3")
    }
});
const upload = multer({ storage: storage });

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
                upload.single('file'),
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
                this.songController.update()
            )
            .delete(
                "/song/:id",
                this.authenticationMiddleware.authenticate(),
                this.songController.delete()
            );
    }
}
