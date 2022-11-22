import express, { Express } from "express";
import { DataSource } from "typeorm";
import "reflect-metadata";

import { serverConfig } from "./config/server-config";
import { dataConfig } from "./config/data-config";
import { UserRoute } from "./routes/user-route";
import { SongRoute } from "./routes/song-route";

export class App {
    dataSource: DataSource;
    server: Express;

    constructor() {
        const userRoute = new UserRoute();
        const songRoute = new SongRoute();

        this.dataSource = new DataSource(dataConfig);

        this.server = express();
        this.server.use(
            "/api",
            [express.json(), express.urlencoded({ extended: true })],
            [userRoute.getRoute(), songRoute.getRoute()]
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
