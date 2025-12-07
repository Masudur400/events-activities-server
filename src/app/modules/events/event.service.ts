/* eslint-disable @typescript-eslint/no-explicit-any */
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
  if (!hostId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Host ID is required!");
  }
  // Required Fields Validation
  if (!eventName) throw new AppError(httpStatus.BAD_REQUEST, "Event name is required!");
  if (!eventType) throw new AppError(httpStatus.BAD_REQUEST, "Event type is required!");
  if (!date) throw new AppError(httpStatus.BAD_REQUEST, "Event date is required!");
  if (!startTime) throw new AppError(httpStatus.BAD_REQUEST, "Start time is required!");
  if (!endTime) throw new AppError(httpStatus.BAD_REQUEST, "End time is required!");
  if (minParticipants === undefined) throw new AppError(httpStatus.BAD_REQUEST, "Minimum participants required!");
  if (maxParticipants === undefined) throw new AppError(httpStatus.BAD_REQUEST, "Maximum participants required!");
  if (joiningFee === undefined) throw new AppError(httpStatus.BAD_REQUEST, "Joining fee is required!");
  // Convert string numbers to actual numbers
  const minPart = Number(minParticipants);
  const maxPart = Number(maxParticipants);
  const fee = Number(joiningFee);
  // Convert date from frontend (calendar input)
  const eventDate = new Date(date as any);
  if (isNaN(eventDate.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format!");
  }

  const event = await Event.create({
    eventName,
    eventType,
    hostId,
    date: eventDate,
    startTime,
    endTime,
    minParticipants: minPart,
    maxParticipants: maxPart,
    joiningFee: fee,
    ...rest,
  });

  return event;
};






interface GetMyEventsQuery {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
  [key: string]: any;
}

const getMyEvents = async (hostId: string, query: GetMyEventsQuery) => {
  if (!hostId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Host ID is required!");
  }
  const { searchTerm, sortBy, sortOrder, page = "1", limit = "10", ...filters } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  // Base filter: only host's events
  const baseFilter: any = { hostId };
  // Search by searchTerm
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i"); // case-insensitive
    baseFilter.$or = eventSearchableFields.map((field) => ({
      [field]: searchRegex,
    }));
  }
  // Additional filters
  Object.keys(filters).forEach((key) => {
    baseFilter[key] = filters[key];
  });
  //  Sort
  let sortOption: any = { createdAt: -1 }; // default newest first
  if (sortBy) {
    sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  }
  // Fetch events with pagination
  const events = await Event.find(baseFilter)
    .populate({ path: "hostId", select: "-password -auths" })
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);
  // Total count for meta
  const total = await Event.countDocuments(baseFilter);
  const totalPages = Math.ceil(total / limitNum);

  const meta = {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
  };
  return { meta, data: events };
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




const deleteMyEvent = async (eventId: string, hostId: string) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  // ✅ Only host who created the event can delete
  if (event.hostId.toString() !== hostId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You can only delete your own events");
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





const updateMyEvent = async (eventId: string, payload: Partial<IEvent>, hostId: string): Promise<IEvent> => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  // ✅ Only host who created event can update
  if (event.hostId.toString() !== hostId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You can only update your own events");
  }

  // Delete old image if new image is uploaded
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
  getMyEvents,
  getAllEvents,
  getSingleEvent,
  deleteEvent,
  deleteMyEvent,
  updateEvent,
  updateMyEvent
};
