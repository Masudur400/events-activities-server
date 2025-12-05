import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ReviewServices } from "./review.service";
import { IEvent } from "../events/event.interface";
import AppError from "../../errorHandler/AppError";



const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; 
  if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized"); 
  const payload: Partial<IEvent> = { ...req.body, userId }; 
  const result = await ReviewServices.createReview(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});


const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewServices.getAllReviews(); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All reviews retrieved successfully",
    data: reviews,
  });
});


const getReviewsByEvent = catchAsync(
  async (req: Request, res: Response) => {
    const eventId = req.params.eventId; 
    const result = await ReviewServices.getReviewsByEvent(
      eventId,
      req.query as Record<string, string>
    ); 
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);






export const ReviewControllers = {
  createReview,
  getReviewsByEvent,
  getAllReviews
};
