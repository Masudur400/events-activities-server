import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { UserServices } from "./user.service"
import { setAuthCookie } from "../../utils/setCookies"
import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHandler/AppError"
import { IUser, Role } from "./user.interface"

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
    const payload = {
        ...req.body, // validated data from validateRequest
        picture: req.file?.path, // photo path
    };

    const result = await UserServices.createHost(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: result,
    });
});



const getAllUser = catchAsync(async (req, res) => {
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



const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    // validated data from Zod
    const payload: Partial<IUser> = { ...req.body };
    // multer file
    if (req.file?.path) {
        payload.picture = req.file.path;
    }
    const updatedUser = await UserServices.updateMyProfile(userId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully",
        data: updatedUser,
    });
});



const updateUserByAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminRole = req.user?.role;
    if (adminRole !== Role.SUPER_ADMIN) {
        res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "Only SUPER_ADMIN can update user status",
        });
        return;
    }
    const userId = req.params.id; // admin update target user
    if (!userId) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "User ID is required",
        });
        return;
    }
    const payload = req.body; // Only isDeleted, isActive, isVerified 
    const updatedUser = await UserServices.updateUserByAdmin(userId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: updatedUser,
    });
});




export const userControllers = {
    createUser,
    createHost,
    getAllUser,
    getSingleUser,
    getMe,
    updateMyProfile,
    updateUserByAdmin
}
