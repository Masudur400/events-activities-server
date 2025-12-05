import AppError from "../../errorHandler/AppError";
import { IEvent } from "./event.interface";
import httpStatus from "http-status";
import { Event } from "./event.model";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/queryBuilder";
import { eventSearchableFields } from "./event.constents";

const createEvent = async (payload: Partial<IEvent>): Promise<IEvent> => {
  const {
    eventName,
    eventType,
    hostId,
    date,
    startTime,
    endTime,
    minParticipants,
    maxParticipants,
    joiningFee,
    ...rest
  } = payload;
  // Required Fields Validation
  if (!eventName) {
    throw new AppError(httpStatus.BAD_REQUEST, "Event name is required!");
  }
  if (!eventType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Event type is required!");
  }
  if (!hostId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Host ID is required!");
  }
  if (!date) {
    throw new AppError(httpStatus.BAD_REQUEST, "Event date is required!");
  }
  if (!startTime) {
    throw new AppError(httpStatus.BAD_REQUEST, "Start time is required!");
  }
  if (!endTime) {
    throw new AppError(httpStatus.BAD_REQUEST, "End time is required!");
  }
  if (minParticipants === undefined || minParticipants === null)
    throw new AppError(httpStatus.BAD_REQUEST, "Minimum participants required!");
  if (maxParticipants === undefined || maxParticipants === null)
    throw new AppError(httpStatus.BAD_REQUEST, "Maximum participants required!");
  if (joiningFee === undefined || joiningFee === null)
    throw new AppError(httpStatus.BAD_REQUEST, "Joining fee is required!");
  // Convert string numbers to actual numbers if needed
  const minPart = typeof minParticipants === "string"
    ? Number(minParticipants)
    : minParticipants;
  const maxPart = typeof maxParticipants === "string"
    ? Number(maxParticipants)
    : maxParticipants;
  const fee = typeof joiningFee === "string"
    ? Number(joiningFee)
    : joiningFee;
  // Convert date string to Date object if needed
  let eventDate: Date;
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format!");
    }
    eventDate = parsedDate;
  } else if (date instanceof Date) {
    eventDate = date;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format!");
  }
  // Create Event
  const event = await Event.create({
    eventName,
    eventType,
    hostId,
    date: eventDate, // parsed Date
    startTime,
    endTime,
    minParticipants: minPart,
    maxParticipants: maxPart,
    joiningFee: fee,
    ...rest, // description, image, status
  });

  return event;
};



const getAllEvents = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Event.find().populate({
    path: "hostId",
    select: "-password -auths"
  }), query)
  // search, filter, sort, e.g 
    .search(eventSearchableFields)
    .filter()
    .sort()
    .fields()
    .pagination();
  const [data, meta] = await Promise.all([queryBuilder.build(), queryBuilder.getMeta()]);
  return { data, meta };
};


const getSingleEvent = async (eventId: string): Promise<IEvent> => {
  const event = await Event.findById(eventId)
    .populate({
      path: "hostId",
      select: "-password -auths",
    });
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }
  return event;
};



const deleteEvent = async (eventId: string) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }
  // Delete event image from Cloudinary if exists
  if (event.image) {
    await deleteImageFromCLoudinary(event.image);
  }
  // Delete event from DB
  await Event.findByIdAndDelete(eventId);
  return { message: "Event deleted successfully" };
};




const updateEvent = async (eventId: string, payload: Partial<IEvent>): Promise<IEvent> => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }
  // আগের image থাকলে এবং নতুন image path আসলে delete করো
  if (payload.image && event.image) {
    await deleteImageFromCLoudinary(event.image);
  }
  // Number/String conversion
  if (payload.minParticipants) {
    payload.minParticipants =
      typeof payload.minParticipants === "string"
        ? Number(payload.minParticipants)
        : payload.minParticipants;
  }
  if (payload.maxParticipants) {
    payload.maxParticipants =
      typeof payload.maxParticipants === "string"
        ? Number(payload.maxParticipants)
        : payload.maxParticipants;
  }
  if (payload.joiningFee) {
    payload.joiningFee =
      typeof payload.joiningFee === "string"
        ? Number(payload.joiningFee)
        : payload.joiningFee;
  }
  // Date conversion
  if (payload.date) {
    payload.date = new Date(payload.date);
  }
  // Update event with payload
  Object.assign(event, payload);
  await event.save();
  return event;
};





export const EventServices = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent
};
