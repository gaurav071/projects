export const apiResponse = (status, data, message = '') => {
    return {
        status,
        data,
        message
    };
};
