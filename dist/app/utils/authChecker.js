"use strict";
// // /* eslint-disable no-console */
// // import { NextFunction, Request, Response } from "express";
// // import httpStatus from "http-status";
// // import { JwtPayload } from "jsonwebtoken"; 
// // import AppError from "../errorHandler/AppError"; 
// // import { envVars } from "../config/env";
// // import { User } from "../modules/user/user.model";
// // import { IsActive } from "../modules/user/user.interface";
// // import { verifyToken } from "../utils/jwt";
// // export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //         const accessToken = req.headers.authorization || req.cookies.accessToken;
// //         if (!accessToken) throw new AppError(403, "No Token Received");
// //         const verifiedToken = verifyToken(accessToken, envVars.ACCESS_SECRET) as JwtPayload;
// //         const isUserExist = await User.findById(verifiedToken.id);
// //         if (!isUserExist) throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
// //         if (!isUserExist.isVerified) throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
// //         if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
// //             throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
// //         }
// //         if (isUserExist.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
// //         if (!authRoles.includes(verifiedToken.role)) throw new AppError(403, "You are not permitted to view this route!!!");
// //         req.user = verifiedToken;
// //         next();
// //     } catch (error) {
// //         console.log("jwt error", error);
// //         next(error);
// //     }
// // };
// /* eslint-disable no-console */
// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import { JwtPayload } from "jsonwebtoken";
// import AppError from "../errorHandler/AppError";
// import { envVars } from "../config/env";
// import { User } from "../modules/user/user.model";
// import { IsActive } from "../modules/user/user.interface";
// import { verifyToken } from "../utils/jwt";
// export const checkAuth =
//   (...authRoles: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       let token: string | undefined;
//       // Authorization header
//       if (req.headers.authorization?.startsWith("Bearer ")) {
//         token = req.headers.authorization.split(" ")[1];
//       }
//       // Cookie
//       else if (req.cookies?.accessToken) {
//         token = req.cookies.accessToken;
//       }
//       if (!token) {
//         throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
//       }
//       const verifiedToken = verifyToken(
//         token,
//         envVars.ACCESS_SECRET
//       ) as JwtPayload;
//       const user = await User.findById(verifiedToken.id);
//       if (!user) throw new AppError(404, "User not found");
//       if (!user.isVerified) throw new AppError(400, "User not verified");
//       if (user.isDeleted) throw new AppError(400, "User is deleted");
//       if (
//         user.isActive === IsActive.BLOCKED ||
//         user.isActive === IsActive.INACTIVE
//       ) {
//         throw new AppError(400, `User is ${user.isActive}`);
//       }
//       if (authRoles.length && !authRoles.includes(verifiedToken.role)) {
//         throw new AppError(403, "Forbidden");
//       }
//       req.user = verifiedToken;
//       next();
//     } catch (error) {
//       if (error instanceof AppError) {
//         return next(error);
//       }
//       next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
//     }
//   };
// // export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //         let token: string | undefined;
// //         // Authorization header priority
// //         if (req.headers.authorization?.startsWith("Bearer ")) {
// //             token = req.headers.authorization.split(" ")[1];
// //         }
// //         // Cookie fallback
// //         else if (req.cookies?.accessToken) {
// //             token = req.cookies.accessToken;
// //         }
// //         if (!token) {
// //             throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
// //         }
// //         //  Verify token
// //         const verifiedToken = verifyToken(token, envVars.ACCESS_SECRET) as JwtPayload;
// //         // Check user exists
// //         const isUserExist = await User.findById(verifiedToken.id);
// //         if (!isUserExist)
// //             throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
// //         if (!isUserExist.isVerified)
// //             throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
// //         if (
// //             isUserExist.isActive === IsActive.BLOCKED ||
// //             isUserExist.isActive === IsActive.INACTIVE
// //         ) {
// //             throw new AppError(
// //                 httpStatus.BAD_REQUEST,
// //                 `User is ${isUserExist.isActive}`
// //             );
// //         }
// //         if (isUserExist.isDeleted)
// //             throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
// //         //   Role check (only if roles provided)
// //         if (authRoles.length && !authRoles.includes(verifiedToken.role)) {
// //             throw new AppError(
// //                 httpStatus.FORBIDDEN,
// //                 "You are not permitted to view this route"
// //             );
// //         }
// //         //  Attach user
// //         req.user = verifiedToken;
// //         next();
// //     } catch (error) {
// //     console.log("JWT ERROR:", error);
// //     // FIX: If the error is already a known AppError (like "User is blocked"), pass it along.
// //     if (error instanceof AppError) {
// //         return next(error);
// //     }
// //     // Only return generic 401 for actual JWT verification failures (JsonWebTokenError)
// //     next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
// // }
// // };
