"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Event" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
}, {
    timestamps: true,
    versionKey: false
});
// Prevent duplicate review per user per event
reviewSchema.index({ eventId: 1, userId: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
