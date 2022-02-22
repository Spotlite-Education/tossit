const alphaNumericCapital = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateCode = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += alphaNumericCapital[Math.floor(Math.random() * alphaNumericCapital.length)];
    }
    return result;
}