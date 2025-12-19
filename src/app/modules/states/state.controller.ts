 
import httpStatus from "http-status";
import { StateService } from "./state.service";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getAdminState = catchAsync(async (req: Request, res: Response) => {
  const result = await StateService.getAdminState(); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin state retrieved successfully",
    data: result,
  });
});

const getHostState = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; 
  const result = await StateService.getHostState(userId); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Host state retrieved successfully",
    data: result,
  });
});


const getUserState = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; 
  const result = await StateService.getUserState(userId); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User state retrieved successfully",
    data: result,
  });
});




export const StateController = {
  getAdminState,
  getHostState,
  getUserState,
};
