import express, { Express } from "express";
import { DataSource } from "typeorm";
import "reflect-metadata";

import { dataConfig } from "./config/data-config";
import { serverConfig } from "./config/server-config";
import { Authentication } from "./middlewares/authentication";

export class App {
    dataSource: DataSource;
    server: Express;

    constructor() {
        this.dataSource = new DataSource(dataConfig);

        const authentication = new Authentication();

        this.server = express();
        this.server.use("/api", [
            express.json(),
            express.urlencoded({ extended: true }),
            authentication.authenticate(),
        ]);
    }

    run() {
        this.dataSource
            .initialize()
            .then(async () => {
                this.server.listen(serverConfig.port, () => {
                    console.log(
                        `Server is running on http://localhost:${serverConfig.port}`
                    );
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
