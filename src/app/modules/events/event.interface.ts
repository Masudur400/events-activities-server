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
  eventType: string; // e.g., Concert, Hike, Dinner
  date: Date;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  minParticipants: number;
  maxParticipants: number;
  description?: string;
  image?: string;
  joiningFee?: number;
  status: EventStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
