const generatePort = (port: string | undefined) => {
    return port ? +port : 3000;
};

export const serverConfig: { port: number } = {
    port: generatePort(process.env.PORT),
};
