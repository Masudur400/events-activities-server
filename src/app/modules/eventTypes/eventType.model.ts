import { Schema, model } from "mongoose";
import { IEventType } from "./eventType.interface";

const eventTypeSchema = new Schema<IEventType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const EventType = model<IEventType>("EventType", eventTypeSchema);
