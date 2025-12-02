import AppError from "../../errorHandler/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { EventTypeSearchableFields } from "./eventType.constents";
import { IEventType } from "./eventType.interface";
import { EventType } from "./eventType.model";
import httpStatus from 'http-status'


const createEventType = async (payload: IEventType) => {
  const { name } = payload; 
  const existing = await EventType.findOne({ name });
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "EventType already exists!");
  } 
  const eventType = await EventType.create({ name });
  return eventType;
};


const getAllEventTypes = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(EventType.find(), query)
        .filter()
        .search(EventTypeSearchableFields)
        .sort()
        .fields()
        .pagination(); 
    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ]); 
    return { data, meta };
};


const deleteEventType = async (id: string) => { 
  const eventType = await EventType.findById(id);
  if (!eventType) {
    throw new AppError(httpStatus.NOT_FOUND, "EventType not found");
  } 
  await EventType.findByIdAndDelete(id); 
  return {
    message: "EventType deleted successfully",
    id
  };
};



export const eventTypeServices = {
createEventType,
getAllEventTypes,
deleteEventType
}