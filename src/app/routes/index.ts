import { Router } from "express"; 
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { EventTypeRoutes } from "../modules/eventTypes/eventType.routes";
import { EventRoutes } from "../modules/events/event.routes";
import { ReviewRoutes } from "../modules/review/review.route";

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
]





moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})