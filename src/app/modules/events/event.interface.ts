import { Types } from "mongoose";

export enum EventStatus {
  OPEN = "OPEN",
  FULL = "FULL",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface IEvent {
  _id?: Types.ObjectId;
  eventName: string;
  eventType: string; 
  hostId: Types.ObjectId
  date: Date;
  startTime: string;  
  endTime: string;   
  minParticipants: number;
  maxParticipants: number;
  description?: string;
  image?: string;
  joiningFee?: number;
  status: EventStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
