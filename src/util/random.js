const alphaNumericCapital = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateCode = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += alphaNumericCapital[Math.floor(Math.random() * alphaNumericCapital.length)];
    }
    return result;
};

export const generateId = () => {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
     };
     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
