import { z } from "zod";

export const createReviewZodSchema = z.object({
  eventId: z
    .string({ error: "Event ID is required" })
    .min(1, { message: "Event ID cannot be empty" }),
  
  rating: z
    .preprocess((val) => Number(val), 
      z.number({ error: "Rating is required" })
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating cannot exceed 5" })
    ),
  
  comment: z
    .string()
    .max(500, { message: "Comment cannot exceed 500 characters" })
    .optional(),
});
