import { Secret } from "jsonwebtoken";

const generateSecret = (secret: string | undefined) => {
    return secret ? secret : Math.random().toString();
};

export const jwtConfig: { secret: Secret } = {
    secret: generateSecret(process.env.JWT_SECRET_KEY),
};
