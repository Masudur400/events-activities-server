import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { eventTypeServices } from "./eventType.service";

const createEventType = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;  
  const result = await eventTypeServices.createEventType(payload); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "EventType created successfully",
    data: result,
  });
});


const getAllEventTypes = catchAsync(async(req, res) => {
    const query = req.query;
    const result = await eventTypeServices.getAllEventTypes(query as Record<string, string>); 
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
});


const deleteEventType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; 
  const result = await eventTypeServices.deleteEventType(id); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: { id: result.id }
  });
});


export const eventTypeControllers ={
createEventType,
getAllEventTypes,
deleteEventType
}