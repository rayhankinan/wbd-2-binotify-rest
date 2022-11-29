const generateSize = () => {
    return process.env.PAGE_SIZE ? +process.env.PAGE_SIZE : 5;
};

export const paginationConfig: { size: number } = {
    size: generateSize(),
};