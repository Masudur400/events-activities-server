import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewZodSchema } from "./review.validation";

const router = Router();

router.post("/create-review",
    checkAuth(...Object.values(Role)),
    validateRequest(createReviewZodSchema),
    ReviewControllers.createReview);

router.get("/all-reviews",
    ReviewControllers.getAllReviews);

router.get("/:eventId",
    ReviewControllers.getReviewsByEvent);

router.delete("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewControllers.deleteReview
);

export const ReviewRoutes = router;
