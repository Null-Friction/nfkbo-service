"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateKBONumber = validateKBONumber;
exports.formatKBONumber = formatKBONumber;
function validateKBONumber(number) {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length === 10 && /^\d{10}$/.test(cleanNumber);
}
function formatKBONumber(number) {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length === 10) {
        return `${cleanNumber.slice(0, 4)}.${cleanNumber.slice(4, 7)}.${cleanNumber.slice(7, 10)}`;
    }
    return number;
}
//# sourceMappingURL=utils.js.map