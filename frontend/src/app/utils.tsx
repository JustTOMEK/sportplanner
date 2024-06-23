import jwt from 'jsonwebtoken';

export interface JwtPayload {
    exp: number;
    iat: number;
    sub: string;
}

export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        // Decode the token without verifying its signature
        const decoded = jwt.decode(token);
        if (decoded && typeof decoded === 'object') {
            return decoded as JwtPayload;
        }
        return null;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};
