/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { EventServices } from "./event.service"; 
import AppError from "../../errorHandler/AppError";



const createEvent = catchAsync(async (req: Request, res: Response) => {
  const hostId = req.user?.id; 
  if (!hostId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized user!");
  } 
  if (req.user.role !== "HOST") {
    throw new AppError(httpStatus.FORBIDDEN, "Only HOST can create events!");
  } 
  const payload = {
    ...req.body,
    hostId,
    image: req.file?.path,
  }; 
  const result = await EventServices.createEvent(payload); 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event Created Successfully",
    data: result,
  });
});


const getEventTypes = catchAsync(async (req: Request, res: Response) => {
  const eventTypes = await EventServices.getAllEventTypes();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event types fetched successfully",
    data: eventTypes,
  });
});




const getMyEvents = catchAsync(async (req: Request, res: Response) => {
  const hostId = req.user?.id; 
  if (!hostId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Host ID is required!");
  } 
  const result = await EventServices.getMyEvents(hostId, req.query as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your events retrieved successfully",
    data: result, 
  });
});




const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.getAllEvents(req.query as Record<string, string>); 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Events retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});


const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const result = await EventServices.getSingleEvent(eventId); 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event Retrieved Successfully",
    data: result,
  });
});



const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const result = await EventServices.deleteEvent(eventId); 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null
  });
});



const deleteMyEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id as string

  // ✅ Pass logged-in host ID to service
  const result = await EventServices.deleteMyEvent(eventId, req.user?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});




const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id; 
  let payload: any = {}; 
  // Form-data: baki field gula JSON string pathabe
  if (req.body.data) {
    try {
      payload = JSON.parse(req.body.data);
    } catch (error) {
      throw new Error("Invalid JSON format in 'data' field");
    }
  } 
  // Form-data: image file
  if (req.file?.path) {
    payload.image = req.file.path;
  } 
  const updatedEvent = await EventServices.updateEvent(eventId, payload); 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event updated successfully",
    data: updatedEvent,
  });
});




const updateMyEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id as string
  let payload: any = {};

  if (req.body.data) {
    try {
      payload = JSON.parse(req.body.data);
    } catch (error) {
      throw new Error("Invalid JSON format in 'data' field");
    }
  }

  if (req.file?.path) {
    payload.image = req.file.path;
  }

  // Pass logged-in host ID to service
  const updatedEvent = await EventServices.updateMyEvent(eventId, payload, req.user?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event updated successfully",
    data: updatedEvent,
  });
});






export const eventControllers = {
    createEvent,
    getEventTypes,
    getMyEvents,
    getAllEvents,
    getSingleEvent,
    deleteEvent,
    deleteMyEvent,
    updateEvent,
    updateMyEvent
}