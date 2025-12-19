import express from "express"; 
import { checkAuth } from "../../middlewares/checkAuth"; 
import { Role } from "../user/user.interface";  
import { bookingControllers } from "./booking.controller";
import { createBookingZodSchema } from "./booking.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// api/booking
router.post("/",
    checkAuth(...Object.values(Role)), 
    validateRequest(createBookingZodSchema),
    bookingControllers.createBooking
);

// api/booking
router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.HOST),
    bookingControllers.getAllBookings
);

// api/booking/my-bookings
router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    bookingControllers.getUserBookings
);

// api/booking/bookingId
// router.get("/:bookingId",
//     checkAuth(...Object.values(Role)),
//     bookingControllers.getSingleBooking
// );

// api/booking/bookingId/status
// router.patch("/:bookingId/status",
//     checkAuth(...Object.values(Role)),
//      validateRequest(updateBookingStatusZodSchema),
//     bookingControllers.updateBookingStatus
// );

export const BookingRoutes = router;