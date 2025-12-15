import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookies";
import { authServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // login user
    const result = await authServices.loginUser({ email, password });
    // set JWT cookies
    setAuthCookie(res, result.tokens);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login successful",
        data: {
            user: result.user,
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
        },
    });
});


const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged out Successfully",
        data: null,
    })
})


const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user as JwtPayload; // checkAuth middleware থেকে 
    await authServices.changePassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed successfully",
      data: null,
    });
  }
);

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  await authServices.forgetPassword(email, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successful",
    data: null,
  });
});



export const authControllers = {
    loginUser,
    logout,
    changePassword,
    forgetPassword
};
