import express, { Express } from "express";
import "reflect-metadata";

export class App {
    server: Express;

    constructor() {
        this.server = express();
        this.addAPI();
    }

    addAPI() {
        this.server.use("/api", [
            express.json(),
            express.urlencoded({ extended: true }),
        ]);
    }
}
