const generateHost = () => {
    return process.env.SOAP_BASE_HOST ? process.env.SOAP_BASE_HOST : "localhost";
};

const generatePort = () => {
    return process.env.SOAP_BASE_PORT ? +process.env.SOAP_BASE_PORT : 8001;
};

export const soapConfig: {host : string, port: number } = {
    host: generateHost(),
    port: generatePort(),
};