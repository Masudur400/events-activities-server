import httpStatus from "http-status";
import AppError from "../../errorHandler/AppError";
import { Review } from "./review.model";
import { IReview } from "./review.interface";
import { Event } from "../events/event.model";  
import { IUser } from "../user/user.interface"; 





export interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}




const createReview = async (payload: Partial<IReview>): Promise<IReview> => {
  const { userId, eventId, rating, comment } = payload; 
  if (!userId || !eventId || rating === undefined) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields");
  } 
  const existingReview = await Review.findOne({ userId, eventId });
  if (existingReview) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this event");
  } 
  const review = await Review.create({ userId, eventId, rating, comment }); 
  const reviews = await Review.find({ eventId });
  const totalReviews = reviews.length;
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews; 
  await Event.findByIdAndUpdate(eventId, {
    totalReviews,
    avgRating: Number(avgRating.toFixed(1)),
  }); 
  return review;
};




const getAllReviews = async (): Promise<IReview[]> => {
    const reviews = await Review.find()
        .populate({
            path: "userId",
            select: "-password -auths",
        })
        .populate({
            path: "eventId",
            select: "-__v",
        });
    if (!reviews || reviews.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No reviews found");
    }
    return reviews;
}; 




const getReviewsByEvent = async (eventId: string, query: Record<string, string> ): Promise<{ data: (IReview & { userId: IUser })[]; meta: MetaData }> => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const skip = (page - 1) * limit; 
  // Fetch total count for meta
  const total = await Review.countDocuments({ eventId }); 
  // Fetch reviews with populate, sort desc, skip & limit
  const data = (await Review.find({ eventId })
      .populate({ path: "userId", select: "name email picture role" })
      .sort({ createdAt: -1 }) // descending by createdAt
      .skip(skip)
      .limit(limit)
      .lean()) as unknown as (IReview & { userId: IUser })[]; 
  const totalPage = Math.ceil(total / limit); 
  const meta: MetaData = { page, limit, total, totalPage }; 
  return { data, meta };
}; 


const deleteReview = async (reviewId: string): Promise<IReview | null> => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  const eventId = review.eventId;

  // রিভিউ ডিলিট করা
  const deletedReview = await Review.findByIdAndDelete(reviewId);

  // ইভেন্টের রেটিং আপডেট করা
  const remainingReviews = await Review.find({ eventId });
  const totalReviews = remainingReviews.length;
  
  const avgRating = totalReviews > 0 
    ? remainingReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
    : 0;

  await Event.findByIdAndUpdate(eventId, {
    totalReviews,
    avgRating: Number(avgRating.toFixed(1)),
  });

  return deletedReview;
};




export const ReviewServices = {
    createReview,
    getReviewsByEvent,
    getAllReviews,
    deleteReview
};
