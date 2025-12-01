import jwt, { SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";
import * as ms from "ms";  

interface JwtPayload {
    id: string;
    role: string;
    email?: string;
}

export const setTokens = (payload: JwtPayload) => {
    const accessOptions: SignOptions = {
        expiresIn: envVars.ACCESS_EXPIRES as ms.StringValue,
    };

    const refreshOptions: SignOptions = {
        expiresIn: envVars.REFRESH_EXPIRES as ms.StringValue,
    };

    const accessToken = jwt.sign(
        payload,
        envVars.ACCESS_SECRET,
        accessOptions
    );

    const refreshToken = jwt.sign(
        payload,
        envVars.REFRESH_SECRET,
        refreshOptions
    );

    return {
        accessToken,
        refreshToken,
    };
};
