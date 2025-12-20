"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
// --------------------------it only use for production -------------------
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: true, // MUST (Vercel / HTTPS)
            sameSite: "none", // MUST (cross-site)
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
exports.setAuthCookie = setAuthCookie;
