import njwt from 'njwt';

export function decodeToken(token) {
    return njwt.verify(token, APP_SECRET).body;
}
export function encodeToken(tokenData) {
    return njwt.create(tokenData, APP_SECRET).compact();
}