import { Router } from "express";

import { UserController } from "../controllers/user-controller";

export class UserRoute {
    userController: UserController;

    constructor() {
        this.userController = new UserController();
    }

    getRoute() {
        return Router()
            .post("/user/token", this.userController.token())
            .post("/user", this.userController.store());
    }
}
