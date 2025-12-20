"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewZodSchema = void 0;
const zod_1 = require("zod");
exports.createReviewZodSchema = zod_1.z.object({
    eventId: zod_1.z
        .string({ error: "Event ID is required" })
        .min(1, { message: "Event ID cannot be empty" }),
    rating: zod_1.z
        .preprocess((val) => Number(val), zod_1.z.number({ error: "Rating is required" })
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating cannot exceed 5" })),
    comment: zod_1.z
        .string()
        .max(500, { message: "Comment cannot exceed 500 characters" })
        .optional(),
});
