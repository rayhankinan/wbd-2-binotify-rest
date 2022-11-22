import { DataSourceOptions } from "typeorm";

import { User } from "../models/user-model";
import { Song } from "../models/song-model";
import { UserSubscriber } from "../subscribers/user-subscriber";

const generateHost = () => {
    return process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : "127.0.0.1";
};

const generatePort = () => {
    return process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432;
};

const generateUsername = () => {
    return process.env.POSTGRES_USER ? process.env.POSTGRES_USER : "postgres";
};

const generatePassword = () => {
    return process.env.POSTGRES_PASSWORD
        ? process.env.POSTGRES_PASSWORD
        : "password";
};

const generateDatabase = () => {
    return process.env.POSTGRES_DB ? process.env.POSTGRES_DB : "binotify_rest";
};

export const dataConfig: DataSourceOptions = {
    type: "postgres",
    host: generateHost(),
    port: generatePort(),
    username: generateUsername(),
    password: generatePassword(),
    database: generateDatabase(),
    synchronize: true,
    logging: true,
    entities: [User, Song],
    subscribers: [UserSubscriber],
    migrations: [],
};
