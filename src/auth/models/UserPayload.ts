export interface UserPayload {
    sub: number;
    email: string;
    nick: string;
    iat?: number;
    exp?: number;
}