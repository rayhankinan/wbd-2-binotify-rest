import { Secret } from "jsonwebtoken";

export const jwtConfig: { secret: Secret } = {
    secret: process.env.JWT_SECRET_KEY,
};
