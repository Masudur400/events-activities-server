import { Request, Response, NextFunction } from "express";
import AppError from "../errorHandler/AppError";
import httpStatus from "http-status";

export const preventLoggedInUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.headers.authorization?.split(" ")[1];

  if (accessToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already logged in. Use change password instead."
    );
  }

  next();
};
