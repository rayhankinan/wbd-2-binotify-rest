import { DataSourceOptions } from "typeorm";

import { User } from "../models/user-model";
import { Song } from "../models/song-model";

export const dataConfig: DataSourceOptions = {
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DBNAME,
    synchronize: true,
    logging: true,
    entities: [User, Song],
    subscribers: [],
    migrations: [],
};
