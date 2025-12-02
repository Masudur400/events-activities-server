import { Schema, model } from "mongoose"; 
import { EventStatus, IEvent } from "./event.interface"; 

const eventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    minParticipants: { type: Number, required: true },
    maxParticipants: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    joiningFee: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: Object.values(EventStatus), 
      default: EventStatus.OPEN 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Event = model<IEvent>("Event", eventSchema); 
