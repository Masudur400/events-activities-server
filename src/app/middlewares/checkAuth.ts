// /* eslint-disable no-console */
// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import { JwtPayload } from "jsonwebtoken"; 
// import AppError from "../errorHandler/AppError"; 
// import { envVars } from "../config/env";
// import { User } from "../modules/user/user.model";
// import { IsActive } from "../modules/user/user.interface";
// import { verifyToken } from "../utils/jwt";

// export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const accessToken = req.headers.authorization || req.cookies.accessToken;
//         if (!accessToken) throw new AppError(403, "No Token Received");

//         const verifiedToken = verifyToken(accessToken, envVars.ACCESS_SECRET) as JwtPayload;

//         const isUserExist = await User.findById(verifiedToken.id);
//         if (!isUserExist) throw new AppError(httpStatus.NOT_FOUND, "User does not exist");

//         if (!isUserExist.isVerified) throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
//         if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
//             throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
//         }
//         if (isUserExist.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
//         if (!authRoles.includes(verifiedToken.role)) throw new AppError(403, "You are not permitted to view this route!!!");

//         req.user = verifiedToken;
//         next();
//     } catch (error) {
//         console.log("jwt error", error);
//         next(error);
//     }
// };



/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHandler/AppError";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // 1. Authorization header priority
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // 2. Cookie fallback
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
        }

        // 3. Verify token
        // Note: verifyToken usually throws a generic Error if invalid, which goes to catch block
        const verifiedToken = verifyToken(token, envVars.ACCESS_SECRET) as JwtPayload;

        // 4. Check user exists
        const isUserExist = await User.findById(verifiedToken.id);
        if (!isUserExist)
            throw new AppError(httpStatus.NOT_FOUND, "User does not exist");

        if (!isUserExist.isVerified)
            throw new AppError(httpStatus.FORBIDDEN, "User is not verified");

        // 5. Check status
        if (
            isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN, // 403 is better than 400 for blocked users
                `User is ${isUserExist.isActive}`
            );
        }

        if (isUserExist.isDeleted)
            throw new AppError(httpStatus.FORBIDDEN, "User is deleted");

        // 6. Role check
        if (authRoles.length && !authRoles.includes(verifiedToken.role)) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not permitted to view this route"
            );
        }

        // 7. Attach user
        req.user = verifiedToken;
        next();

    } catch (error) {
        console.log("Auth Middleware Error:", error);

        // --- CRITICAL FIX START ---
        // If the error is one we intentionally threw above (like "User is blocked"),
        // pass it straight to the global error handler.
        if (error instanceof AppError) {
            return next(error);
        }
        // --- CRITICAL FIX END ---

        // If it's an unknown error (like JWT signature mismatch), return 401
        next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
    }
};
