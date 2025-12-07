import { Router } from "express"; 
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { EventTypeRoutes } from "../modules/eventTypes/eventType.routes";
import { EventRoutes } from "../modules/events/event.routes";
import { ReviewRoutes } from "../modules/review/review.route";
import { BookingRoutes } from "../modules/bookings/booking.route";
import { PaymentRoutes } from "../modules/payments/payment.route";
import { StateRoutes } from "../modules/states/state.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    }, 
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/event-type',
        route: EventTypeRoutes
    },
    {
        path: '/event',
        route: EventRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    },
    {
        path: '/booking',
        route: BookingRoutes
    },
    {
        path: '/payment',
        route: PaymentRoutes
    },
    {
        path: '/state',
        route: StateRoutes
    },
]





moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})