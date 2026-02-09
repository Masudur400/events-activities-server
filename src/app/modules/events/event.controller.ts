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




const getDeletedEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.getDeletedEvents(req.query); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deleted events retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});



const getMyDeletedEvents = catchAsync(async (req: Request, res: Response) => {
  const hostId = req.user?.id;
  const result = await EventServices.getMyDeletedEvents(hostId, req.query); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your deleted events retrieved successfully",
    meta: result.meta,
    data: result.data,
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
  const result = await EventServices.deleteMyEvent(eventId, req.user?.id); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});


const softDeleteEventByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; 
  const result = await EventServices.softDeleteEventByAdmin(id); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event deleted successfully",
    data: result,
  });
});


const restoreEventByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; 
  const result = await EventServices.restoreEventByAdmin(id); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event restored successfully",
    data: result,
  });
});



const softDeleteMyEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id as string;
  const hostId = req.user?.id; 
  const result = await EventServices.softDeleteMyEvent(eventId, hostId); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your event has been deleted successfully",
    data: result,
  });
});


const restoreMyEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id as string;
  const hostId = req.user?.id;  
  const result = await EventServices.restoreMyEvent(eventId, hostId); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your event has been restored successfully",
    data: result,
  });
});




const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id; 
  let payload: any = {};  
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
    getDeletedEvents,
    getMyDeletedEvents,
    getSingleEvent,
    deleteEvent,
    softDeleteEventByAdmin,
    restoreEventByAdmin,
    softDeleteMyEvent,
    restoreMyEvent,
    deleteMyEvent,
    updateEvent,
    updateMyEvent
}