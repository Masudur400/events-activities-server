import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { bookingServices } from "./booking.service";



const createBooking = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id; 
   const booking = await bookingServices.createBooking(req.body, userId)
   
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking Created Successfully",
    data: booking,
  });
});



const getAllBookings = catchAsync(async (req: Request, res: Response) => {
   
   
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event Created Successfully",
    data: '',
  });
});



const getUserBookings = catchAsync(async (req: Request, res: Response) => {
   
   
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event Created Successfully",
    data: '',
  });
});



const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
   
   
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event Created Successfully",
    data: '',
  });
});



const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
   
   
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event Created Successfully",
    data: '',
  });
});



 



export const bookingControllers = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus,
}