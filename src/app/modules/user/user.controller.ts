import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { UserServices } from "./user.service" 
import { setAuthCookie } from "../../utils/setCookies"
import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHandler/AppError"

const createUser = catchAsync(async (req: Request, res: Response) => {
    const { user, tokens } = await UserServices.createUser(req.body) 
    setAuthCookie(res, tokens) 
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: {
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        },
    })
})


const createHost = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServices.createHost(req.body) 
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
})

const getAllUser = catchAsync(async(req, res) => {
    const query = req.query;
    const result = await UserServices.getAllUsers(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
});


const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id); 
    if (!result.user) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
    } 
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrieved Successfully",
        data: result.user
    });
});



const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload; 
    const result = await UserServices.getMe(decodedToken.id); 
    if (!result.data) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
    }
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Retrieved Successfully",
        data: result.data
    });
});


export const userControllers = {
    createUser,
    createHost,
    getAllUser,
    getSingleUser,
    getMe,
}
