export const bcryptConfig: { saltRounds: number } = {
    saltRounds: +process.env.SALT_ROUNDS,
};
