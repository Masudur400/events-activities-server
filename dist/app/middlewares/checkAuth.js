"use strict";
// /* eslint-disable no-console */
// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import { JwtPayload } from "jsonwebtoken"; 
// import AppError from "../errorHandler/AppError"; 
// import { envVars } from "../config/env";
// import { User } from "../modules/user/user.model";
// import { IsActive } from "../modules/user/user.interface";
// import { verifyToken } from "../utils/jwt";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errorHandler/AppError"));
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const jwt_1 = require("../utils/jwt");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let token;
        // 1. Authorization header priority
        if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // 2. Cookie fallback
        else if ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided");
        }
        // 3. Verify token
        // Note: verifyToken usually throws a generic Error if invalid, which goes to catch block
        const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.ACCESS_SECRET);
        // 4. Check user exists
        const isUserExist = yield user_model_1.User.findById(verifiedToken.id);
        if (!isUserExist)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
        if (!isUserExist.isVerified)
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is not verified");
        // 5. Check status
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, // 403 is better than 400 for blocked users
            `User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted)
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is deleted");
        // 6. Role check
        if (authRoles.length && !authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not permitted to view this route");
        }
        // 7. Attach user
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("Auth Middleware Error:", error);
        // --- CRITICAL FIX START ---
        // If the error is one we intentionally threw above (like "User is blocked"),
        // pass it straight to the global error handler.
        if (error instanceof AppError_1.default) {
            return next(error);
        }
        // --- CRITICAL FIX END ---
        // If it's an unknown error (like JWT signature mismatch), return 401
        next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token"));
    }
});
exports.checkAuth = checkAuth;
