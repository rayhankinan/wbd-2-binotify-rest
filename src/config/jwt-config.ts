import { Secret } from "jsonwebtoken";

const generateSecret = (secret: string | undefined) => {
    return secret ? secret : Math.random().toString();
};

const generateExpiresIn = (expiresIn: string | undefined) => {
    return expiresIn ? expiresIn : "1h";
};

export const jwtConfig: { secret: Secret; expiresIn: string } = {
    secret: generateSecret(process.env.JWT_SECRET_KEY),
    expiresIn: generateExpiresIn(process.env.JWT_EXPIRES_IN),
};
