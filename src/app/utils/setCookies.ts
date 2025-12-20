import { Response } from "express";  
// import { envVars } from "../config/env";

export interface AuthTokens {
    accessToken?: string
    refreshToken?: string
}


// --------------------------it only use for production -------------------

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,        // MUST (Vercel / HTTPS)
      sameSite: "none",    // MUST (cross-site)
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });
  }
};