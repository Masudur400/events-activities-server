import { Types } from "mongoose";

export interface IEventType {
    _id?: Types.ObjectId;
    name: string;
}
