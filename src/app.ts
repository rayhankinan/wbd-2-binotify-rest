import express, { Express } from "express";
import { DataSource } from "typeorm";
import "reflect-metadata";

import { serverConfig } from "./config/server-config";
import { dataConfig } from "./config/data-config";
import { UserRoute } from "./routes/user-route";

export class App {
    dataSource: DataSource;
    server: Express;

    constructor() {
        this.dataSource = new DataSource(dataConfig);

        const userRoute = new UserRoute();

        this.server = express();
        this.server.use(
            "/api",
            [express.json(), express.urlencoded({ extended: true })],
            userRoute.getRoute()
        );
    }

    run() {
        this.dataSource
            .initialize()
            .then(async () => {
                this.server.listen(serverConfig.port, () => {
                    console.log(
                        `Server is running on port: ${serverConfig.port}`
                    );
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
