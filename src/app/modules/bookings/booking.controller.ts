import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { bookingServices } from "./booking.service";
import AppError from "../../errorHandler/AppError";



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
  const userRole = req.user?.role;
  if (!userRole) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User role not found");
  } 
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10; 
  const result = await bookingServices.getAllBookings(userRole, page, limit); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Bookings Retrieved Successfully",
    data: result.bookings, 
  });
});





const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; 
  if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, "User not found"); 
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10; 
  const result = await bookingServices.getUserBookings(userId, page, limit); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Bookings Retrieved Successfully",
    data: result, 
  });
});


 



// const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
//   const bookingId = req.params.bookingId;
//   const booking = await bookingServices.getSingleBooking(bookingId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Booking Retrieved Successfully",
//     data: booking,
//   });
// });





// const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
//   const bookingId = req.params.bookingId;
//   const { status } = req.body;

//   const booking = await bookingServices.updateBookingStatus(bookingId, status);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Booking Status Updated Successfully",
//     data: booking,
//   });
// });

 



export const bookingControllers = {
    createBooking,
    getAllBookings,
    getUserBookings,
    // getSingleBooking,
    // updateBookingStatus,
}