import bcrypt from "bcrypt";

const generateSaltRounds = (saltRounds: string | undefined) => {
    return saltRounds ? +saltRounds : 10;
};

export const bcryptConfig: { saltRounds: number } = {
    saltRounds: generateSaltRounds(process.env.SALT_ROUNDS),
};
