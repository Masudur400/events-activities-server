"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const review_model_1 = require("./review.model");
const event_model_1 = require("../events/event.model");
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, eventId, rating, comment } = payload;
    if (!userId || !eventId || rating === undefined) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Missing required fields");
    }
    const existingReview = yield review_model_1.Review.findOne({ userId, eventId });
    if (existingReview) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already reviewed this event");
    }
    const review = yield review_model_1.Review.create({ userId, eventId, rating, comment });
    const reviews = yield review_model_1.Review.find({ eventId });
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
    yield event_model_1.Event.findByIdAndUpdate(eventId, {
        totalReviews,
        avgRating: Number(avgRating.toFixed(1)),
    });
    return review;
});
const getAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find()
        .populate({
        path: "userId",
        select: "-password -auths",
    })
        .populate({
        path: "eventId",
        select: "-__v",
    });
    if (!reviews || reviews.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No reviews found");
    }
    return reviews;
});
const getReviewsByEvent = (eventId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    // Fetch total count for meta
    const total = yield review_model_1.Review.countDocuments({ eventId });
    // Fetch reviews with populate, sort desc, skip & limit
    const data = (yield review_model_1.Review.find({ eventId })
        .populate({ path: "userId", select: "name email picture role" })
        .sort({ createdAt: -1 }) // descending by createdAt
        .skip(skip)
        .limit(limit)
        .lean());
    const totalPage = Math.ceil(total / limit);
    const meta = { page, limit, total, totalPage };
    return { data, meta };
});
const deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId);
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    const eventId = review.eventId;
    // রিভিউ ডিলিট করা
    const deletedReview = yield review_model_1.Review.findByIdAndDelete(reviewId);
    // ইভেন্টের রেটিং আপডেট করা
    const remainingReviews = yield review_model_1.Review.find({ eventId });
    const totalReviews = remainingReviews.length;
    const avgRating = totalReviews > 0
        ? remainingReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;
    yield event_model_1.Event.findByIdAndUpdate(eventId, {
        totalReviews,
        avgRating: Number(avgRating.toFixed(1)),
    });
    return deletedReview;
});
exports.ReviewServices = {
    createReview,
    getReviewsByEvent,
    getAllReviews,
    deleteReview
};
