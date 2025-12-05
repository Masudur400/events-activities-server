/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { EventServices } from "./event.service"; 



const createEvent = catchAsync(async (req: Request, res: Response) => {
  const payload = {
  ...req.body,
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






export const eventControllers = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    deleteEvent,
    updateEvent
}