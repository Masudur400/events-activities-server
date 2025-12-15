
import AppError from "../../errorHandler/AppError";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs";
import { setTokens } from "../../utils/setTokens";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

interface LoginPayload {
    email: string;
    password: string;
}

const loginUser = async (payload: LoginPayload) => {
    const { email, password } = payload;
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
    }
    // ensure password exists
    if (!user.password) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "User password not set");
    }
    // compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    // check if user is active / verified
    if (!user.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
    }
    // generate tokens
    const tokens = setTokens({
        id: user._id.toString(),
        role: user.role,
        email: user.email, // optional but useful for middleware
    });
    return { user, tokens };
};


const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    // Token থেকে userId নেওয়া
    const user = await User.findById(decodedToken.id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    // Old password match check
    const isOldPasswordMatch = await bcryptjs.compare(
        oldPassword,
        user.password as string
    );
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
    }
    // New password hash করে save করা
    user.password = await bcryptjs.hash(
        newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    );
    await user.save();
    return true;
};



const forgetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found with this email");
  }

  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  await user.save();

  return true;
};




export const authServices = {
    loginUser,
    changePassword,
    forgetPassword
};
