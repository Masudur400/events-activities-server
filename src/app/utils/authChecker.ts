/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import AppError from "../errorHandler/AppError";
import httpStatus from "http-status";
import { envVars } from "../config/env";

/**
 * Auth middleware: verify JWT access token and set req.user
 */
export const authChecker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, envVars.ACCESS_SECRET) as any;

    // find user in DB
    const user = await User.findById(decoded.userId);
    if (!user) throw new AppError(httpStatus.UNAUTHORIZED, "User not found");

    // check if user is active and not deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
    }
    if (user.isActive !== "ACTIVE") {
      throw new AppError(httpStatus.UNAUTHORIZED, `User is ${user.isActive}`);
    }

    // ✅ set req.user
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
