import express from "express"; 
import { checkAuth } from "../../middlewares/checkAuth"; 
import { Role } from "../user/user.interface";  
import { bookingControllers } from "./booking.controller";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// api/v1/booking
router.post("/",
    checkAuth(...Object.values(Role)), 
    validateRequest(createBookingZodSchema),
    bookingControllers.createBooking
);

// api/v1/booking
router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    bookingControllers.getAllBookings
);

// api/v1/booking/my-bookings
router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    bookingControllers.getUserBookings
);

// api/v1/booking/bookingId
router.get("/:bookingId",
    checkAuth(...Object.values(Role)),
    bookingControllers.getSingleBooking
);

// api/v1/booking/bookingId/status
router.patch("/:bookingId/status",
    checkAuth(...Object.values(Role)),
     validateRequest(updateBookingStatusZodSchema),
    bookingControllers.updateBookingStatus
);

export const BookingRoutes = router;