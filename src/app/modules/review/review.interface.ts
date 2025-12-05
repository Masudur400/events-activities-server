import { Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number; // 1 to 5
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
