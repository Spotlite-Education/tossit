const safeChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function sanitizeCode(code) {
    const filtered = code.split('').filter(char => safeChars.includes(char));
    return filtered.length > 6 ? filtered.slice(0, 6) : filtered;
}
