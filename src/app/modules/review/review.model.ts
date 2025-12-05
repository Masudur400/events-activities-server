import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true, ref: "Event" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Prevent duplicate review per user per event
reviewSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Review = model<IReview>("Review", reviewSchema);