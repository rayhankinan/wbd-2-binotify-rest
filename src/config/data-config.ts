import { DataSourceOptions } from "typeorm";

import { User } from "../models/user";
import { Song } from "../models/song";

export const dataConfig: DataSourceOptions = {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "127.0.0.1",
    port: +(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DBNAME || "binotify_rest",
    synchronize: true,
    logging: true,
    entities: [User, Song],
    subscribers: [],
    migrations: [],
};
